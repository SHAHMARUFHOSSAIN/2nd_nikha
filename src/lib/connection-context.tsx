'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Interest, Match, Profile, InterestStatus } from '@/types';
import { PaymentService } from './payment/payment-service';
import { MEMBERSHIP_CONFIG } from './constants';
import { useAuth } from './auth-context';

interface ConnectionContextType {
  interests: Interest[];
  matches: Match[];
  blockedUserIds: string[];
  reportedUserIds: string[];
  activeMatchModal: Match | null;
  notifications: { id: string; title: string; message: string; date: string; read: boolean }[];
  closeMatchModal: () => void;
  sendInterestRequest: (targetProfile: Profile) => Promise<{ success: boolean; redirectUrl?: string; message?: string }>;
  activateInterestAfterPayment: (txnId: string, recipientId: string) => void;
  acceptInterest: (interestId: string) => void;
  declineInterest: (interestId: string) => void;
  cancelInterest: (interestId: string) => void;
  blockUser: (userId: string) => void;
  reportUser: (userId: string, reason: string, details?: string) => void;
  getInterestStatus: (profileId: string) => InterestStatus | 'NONE';
  isMatched: (profileId: string) => boolean;
  getMatchByProfileId: (profileId: string) => Match | undefined;
}

const ConnectionContext = createContext<ConnectionContextType>({
  interests: [],
  matches: [],
  blockedUserIds: [],
  reportedUserIds: [],
  activeMatchModal: null,
  notifications: [],
  closeMatchModal: () => {},
  sendInterestRequest: async () => ({ success: false }),
  activateInterestAfterPayment: () => {},
  acceptInterest: () => {},
  declineInterest: () => {},
  cancelInterest: () => {},
  blockUser: () => {},
  reportUser: () => {},
  getInterestStatus: () => 'NONE',
  isMatched: () => false,
  getMatchByProfileId: () => undefined,
});

const api = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store', ...init });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) throw new Error(json?.error || `Request failed: ${res.status}`);
  return json;
};

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [reportedUserIds, setReportedUserIds] = useState<string[]>([]);
  const [activeMatchModal, setActiveMatchModal] = useState<Match | null>(null);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; date: string; read: boolean }[]
  >([]);

  const { currentUser: authUser, sessionReady } = useAuth();
  const currentUser = authUser;

  const refreshInterests = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const json = await api('/api/interests');
      setInterests(json.interests || []);
    } catch {}
  }, [currentUser?.id]);

  const refreshMatches = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const json = await api('/api/matches');
      setMatches(json.matches || []);
    } catch {}
  }, [currentUser?.id]);

  const refreshNotifications = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const json = await api('/api/notifications');
      setNotifications(json.notifications || []);
    } catch {}
  }, [currentUser?.id]);

  const refreshBlocks = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      const json = await api('/api/blocks');
      setBlockedUserIds(json.blockedUserIds || []);
    } catch {}
  }, [currentUser?.id]);

  useEffect(() => {
    if (!sessionReady) return;
    if (!currentUser?.id) {
      setInterests([]);
      setMatches([]);
      setBlockedUserIds([]);
      setNotifications([]);
      return;
    }
    refreshInterests();
    refreshMatches();
    refreshNotifications();
    refreshBlocks();
  }, [sessionReady, currentUser?.id, refreshInterests, refreshMatches, refreshNotifications, refreshBlocks]);

  const closeMatchModal = () => setActiveMatchModal(null);

  const getInterestStatus = (profileId: string): InterestStatus | 'NONE' => {
    if (!currentUser?.id) return 'NONE';
    const found = interests.find(
      (i) =>
        (i.senderId === currentUser.id && i.receiverId === profileId) ||
        (i.receiverId === currentUser.id && i.senderId === profileId)
    );
    return found ? found.status : 'NONE';
  };

  const isMatched = (profileId: string): boolean => {
    if (!currentUser?.id) return false;
    return matches.some(
      (m) =>
        (m.userOneId === currentUser.id && m.userTwoId === profileId) ||
        (m.userTwoId === currentUser.id && m.userOneId === profileId)
    );
  };

  const getMatchByProfileId = (profileId: string): Match | undefined => {
    if (!currentUser?.id) return undefined;
    return matches.find(
      (m) =>
        (m.userOneId === currentUser.id && m.userTwoId === profileId) ||
        (m.userTwoId === currentUser.id && m.userOneId === profileId)
    );
  };

  const sendInterestRequest = async (targetProfile: Profile) => {
    if (!currentUser?.id) {
      return { success: false, message: 'Please log in to send an interest.' };
    }

    const existingStatus = getInterestStatus(targetProfile.id);
    if (existingStatus === 'SENT' || existingStatus === 'ACCEPTED' || existingStatus === 'PENDING') {
      return {
        success: false,
        message: `Interest already sent to ${targetProfile.fullName}.`,
      };
    }

    let redirectUrl: string | undefined;
    try {
      const paymentInit = await PaymentService.initiatePayment({
        userId: currentUser.id,
        recipientId: targetProfile.id,
        purpose: 'interest',
        amount: MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT,
        currency: 'BDT',
        customerName: currentUser.fullName,
        customerEmail: currentUser.email || '',
        customerPhone: currentUser.phone || '',
      });
      redirectUrl = paymentInit?.redirectUrl;
    } catch (err) {
      // payment gateway is optional; continue to record the interest
    }

    try {
      await api('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: targetProfile.id }),
      });
      await refreshInterests();
      await refreshNotifications();
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to send interest.' };
    }

    return { success: true, redirectUrl };
  };

  const activateInterestAfterPayment = (txnId: string, recipientId: string) => {
    if (!currentUser?.id) return;
    (async () => {
      try {
        await api('/api/interests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiverId: recipientId }),
        });
      } catch {}
      await refreshInterests();
      await refreshNotifications();
    })();
  };

  const acceptInterest = (interestId: string) => {
    (async () => {
      try {
        const json = await api(`/api/interests/${encodeURIComponent(interestId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ACCEPTED' }),
        });
        await refreshInterests();
        if (json.match) {
          setMatches((prev) => {
            const others = prev.filter((m) => m.id !== json.match.id);
            return [json.match, ...others];
          });
          setActiveMatchModal(json.match);
        } else {
          await refreshMatches();
        }
        await refreshNotifications();
      } catch {}
    })();
  };

  const declineInterest = (interestId: string) => {
    setInterests((prev) => prev.map((i) => (i.id === interestId ? { ...i, status: 'REJECTED' } : i)));
    api(`/api/interests/${encodeURIComponent(interestId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'REJECTED' }),
    }).catch(() => {});
  };

  const cancelInterest = (interestId: string) => {
    setInterests((prev) => prev.map((i) => (i.id === interestId ? { ...i, status: 'CANCELLED' } : i)));
    api(`/api/interests/${encodeURIComponent(interestId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    }).catch(() => {});
  };

  const blockUser = (userId: string) => {
    setBlockedUserIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    api('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).catch(() => {});
  };

  const reportUser = (userId: string, reason: string, details?: string) => {
    setReportedUserIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    api('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason, details }),
    }).catch(() => {});
  };

  return (
    <ConnectionContext.Provider
      value={{
        interests,
        matches,
        blockedUserIds,
        reportedUserIds,
        activeMatchModal,
        notifications,
        closeMatchModal,
        sendInterestRequest,
        activateInterestAfterPayment,
        acceptInterest,
        declineInterest,
        cancelInterest,
        blockUser,
        reportUser,
        getInterestStatus,
        isMatched,
        getMatchByProfileId,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}

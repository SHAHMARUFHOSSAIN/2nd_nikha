'use client';

import React, { createContext, useContext, useState } from 'react';
import { Interest, Match, Profile, InterestStatus, Payment } from '@/types';
import { MOCK_INTERESTS, MOCK_MATCHES } from '@/data/connection-data';
import { MOCK_PAYMENTS } from '@/data/subscription-data';
import { MOCK_PROFILES } from '@/data/mock-data';
import { PaymentService } from './payment/payment-service';
import { MEMBERSHIP_CONFIG } from './constants';

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
  reportUser: (userId: string, reason: string) => void;
  getInterestStatus: (profileId: string) => InterestStatus | 'NONE';
  isMatched: (profileId: string) => boolean;
  getMatchByProfileId: (profileId: string) => Match | undefined;
}

const ConnectionContext = createContext<ConnectionContextType>({
  interests: MOCK_INTERESTS,
  matches: MOCK_MATCHES,
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

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [interests, setInterests] = useState<Interest[]>(MOCK_INTERESTS);
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [reportedUserIds, setReportedUserIds] = useState<string[]>([]);
  const [activeMatchModal, setActiveMatchModal] = useState<Match | null>(null);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; date: string; read: boolean }[]
  >([
    {
      id: 'notif-1',
      title: 'Interest Received',
      message: 'Tanvir Ahmed sent you an express interest request.',
      date: '10 mins ago',
      read: false,
    },
  ]);

  const currentUser = MOCK_PROFILES[0]; // Anika Rahman

  const closeMatchModal = () => setActiveMatchModal(null);

  const getInterestStatus = (profileId: string): InterestStatus | 'NONE' => {
    const safeInterests = Array.isArray(interests) ? interests : MOCK_INTERESTS;
    const found = safeInterests.find(
      (i) =>
        (i.senderId === currentUser.id && i.receiverId === profileId) ||
        (i.receiverId === currentUser.id && i.senderId === profileId)
    );
    return found ? found.status : 'NONE';
  };

  const isMatched = (profileId: string): boolean => {
    const safeMatches = Array.isArray(matches) ? matches : MOCK_MATCHES;
    return safeMatches.some(
      (m) =>
        (m.userOneId === currentUser.id && m.userTwoId === profileId) ||
        (m.userTwoId === currentUser.id && m.userOneId === profileId)
    );
  };

  const getMatchByProfileId = (profileId: string): Match | undefined => {
    const safeMatches = Array.isArray(matches) ? matches : MOCK_MATCHES;
    return safeMatches.find(
      (m) =>
        (m.userOneId === currentUser.id && m.userTwoId === profileId) ||
        (m.userTwoId === currentUser.id && m.userOneId === profileId)
    );
  };

  const sendInterestRequest = async (targetProfile: Profile) => {
    const existingStatus = getInterestStatus(targetProfile.id);

    if (existingStatus === 'SENT' || existingStatus === 'ACCEPTED') {
      return {
        success: false,
        message: `Interest already sent to ${targetProfile.fullName}.`,
      };
    }

    // Initiate Mock Payment Session
    const paymentInit = await PaymentService.initiatePayment({
      userId: currentUser.id,
      recipientId: targetProfile.id,
      purpose: 'interest',
      amount: MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT,
      currency: 'BDT',
      customerName: currentUser.fullName,
      customerEmail: 'anika.rahman@example.com',
      customerPhone: '01712345678',
    });

    const newInterest: Interest = {
      id: `int-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: targetProfile.id,
      senderProfile: currentUser,
      receiverProfile: targetProfile,
      status: 'PAYMENT_PENDING',
      paymentTransactionId: paymentInit.transactionId,
      createdAt: 'Just now',
    };

    setInterests((prev) => [newInterest, ...prev]);

    return {
      success: true,
      redirectUrl: paymentInit.redirectUrl,
    };
  };

  const activateInterestAfterPayment = (txnId: string, recipientId: string) => {
    const recipientProfile = MOCK_PROFILES.find((p) => p.id === recipientId) || MOCK_PROFILES[1];

    setInterests((prev) =>
      (Array.isArray(prev) ? prev : MOCK_INTERESTS).map((i) =>
        i.paymentTransactionId === txnId || i.receiverId === recipientId
          ? { ...i, status: 'SENT' }
          : i
      )
    );

    // Record Payment in Payment History
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      userId: currentUser.id,
      transactionId: txnId,
      amount: MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT,
      currency: 'BDT',
      gateway: 'MockPaymentGateway',
      status: 'PAID',
      paidAt: 'Just now',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      purpose: 'interest',
    };

    MOCK_PAYMENTS.unshift(newPayment);

    // Add Notifications
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: 'Interest Sent ❤️',
        message: `Your payment was successful and express interest has been sent to ${recipientProfile.fullName}.`,
        date: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const acceptInterest = (interestId: string) => {
    const safeInterests = Array.isArray(interests) ? interests : MOCK_INTERESTS;
    const targetInterest = safeInterests.find((i) => i.id === interestId);
    if (!targetInterest) return;

    setInterests((prev) =>
      prev.map((i) => (i.id === interestId ? { ...i, status: 'ACCEPTED' } : i))
    );

    const otherProfile =
      targetInterest.senderId === currentUser.id
        ? targetInterest.receiverProfile
        : targetInterest.senderProfile;

    const newMatch: Match = {
      id: `match-${Date.now()}`,
      userOneId: currentUser.id,
      userTwoId: otherProfile.id,
      profile: otherProfile,
      compatibilityScore: otherProfile.matchPercentage || 92,
      matchedAt: 'Just now',
      status: 'ACTIVE',
    };

    setMatches((prev) => [newMatch, ...prev]);
    setActiveMatchModal(newMatch);
  };

  const declineInterest = (interestId: string) => {
    setInterests((prev) =>
      prev.map((i) => (i.id === interestId ? { ...i, status: 'REJECTED' } : i))
    );
  };

  const cancelInterest = (interestId: string) => {
    setInterests((prev) =>
      prev.map((i) => (i.id === interestId ? { ...i, status: 'CANCELLED' } : i))
    );
  };

  const blockUser = (userId: string) => {
    setBlockedUserIds((prev) => [...prev, userId]);
  };

  const reportUser = (userId: string, reason: string) => {
    setReportedUserIds((prev) => [...prev, userId]);
  };

  return (
    <ConnectionContext.Provider
      value={{
        interests: Array.isArray(interests) ? interests : MOCK_INTERESTS,
        matches: Array.isArray(matches) ? matches : MOCK_MATCHES,
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

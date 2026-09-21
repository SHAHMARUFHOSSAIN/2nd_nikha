'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Conversation, Message, SharedPhoto, Profile } from '@/types';
import { useAuth } from '@/lib/auth-context';

export function buildMatchId(id1: string, id2: string): string {
  if (!id1 || !id2) return id1 || id2 || 'match-default';
  const cleanId1 = id1.replace(/^match[-_]/, '');
  const cleanId2 = id2.replace(/^match[-_]/, '');
  const sorted = [cleanId1, cleanId2].sort();
  return `match_${sorted[0]}_${sorted[1]}`;
}

interface CommunicationContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sharedPhotos: Record<string, SharedPhoto[]>;
  totalUnreadCount: number;
  sendMessage: (
    matchIdOrObj: string | { matchId: string; content?: string; text?: string; receiverId?: string; senderId?: string; type?: any; mediaUrl?: string },
    text?: string,
    receiverIdOrType?: string
  ) => void;
  editMessage: (matchId: string, messageId: string, newText: string) => void;
  deleteMessage: (matchId: string, messageId: string) => void;
  shareContactInChat: (matchId: string, receiverId: string, details: { phone?: string; whatsapp?: string; email?: string }) => void;
  sharePhotoInChat: (matchId: string, photoUrl: string, receiverIdOrCaption?: string, caption?: string) => void;
  deletePhoto: (matchId: string, photoId: string) => void;
  markAsRead: (matchId: string) => void;
  startConversationWithProfile: (profile: Profile) => string;
  requestWhatsAppExchange: (matchId: string, receiverId: string, recipientName: string) => void;
  respondToWhatsAppRequest?: (matchId: string, messageId: string, action: 'ACCEPT' | 'DECLINE') => void;
  toggleBlockConversation: (matchId: string) => void;
  deleteConversation: (matchId: string) => void;
}

const CommunicationContext = createContext<CommunicationContextType>({
  conversations: [],
  messages: {},
  sharedPhotos: {},
  totalUnreadCount: 0,
  sendMessage: () => {},
  editMessage: () => {},
  deleteMessage: () => {},
  shareContactInChat: () => {},
  sharePhotoInChat: () => {},
  deletePhoto: () => {},
  markAsRead: () => {},
  startConversationWithProfile: () => '',
  requestWhatsAppExchange: () => {},
  respondToWhatsAppRequest: () => {},
  toggleBlockConversation: () => {},
  deleteConversation: () => {},
});

export function isSameUser(profileOrId: Profile | string | undefined | null, targetUser: Profile | null): boolean {
  if (!targetUser || !profileOrId) return false;
  const curId = targetUser.id?.trim().toLowerCase();
  const curEmail = targetUser.email?.trim().toLowerCase();

  if (typeof profileOrId === 'string') {
    const target = profileOrId.trim().toLowerCase();
    if (!target) return false;
    return target === curId || (Boolean(curEmail) && target === curEmail);
  }

  const pId = profileOrId.id?.trim().toLowerCase();
  const pEmail = profileOrId.email?.trim().toLowerCase();

  return (
    (Boolean(pId) && Boolean(curId) && pId === curId) ||
    (Boolean(pEmail) && Boolean(curEmail) && pEmail === curEmail)
  );
}

export function findProfileByIdOrEmail(idOrEmail: string | undefined | null, profiles: Profile[]): Profile | undefined {
  if (!idOrEmail || typeof idOrEmail !== 'string') return undefined;
  const target = idOrEmail.trim().toLowerCase();
  if (!target || target === 'unknown') return undefined;
  return profiles.find((p) => p.id?.trim().toLowerCase() === target);
}

const api = async (url: string, init?: RequestInit) => {
  const res = await fetch(url, { credentials: 'include', cache: 'no-store', ...init });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.error || `Request failed: ${res.status}`);
  }
  return json;
};

export function CommunicationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const { currentUser: authUser, sessionReady } = useAuth();
  const currentUser = authUser;

  const activeMatchIdRef = useRef<string>('');

  const fetchConversations = useCallback(async () => {
    if (!currentUser?.id) {
      setConversations([]);
      return;
    }
    try {
      const json = await api('/api/conversations');
      setConversations(json.conversations || []);
    } catch (err) {
      // unauthenticated / network errors are non-fatal here
    }
  }, [currentUser?.id]);

  const fetchMessages = useCallback(async (matchId: string) => {
    if (!matchId || !currentUser?.id) return;
    try {
      const json = await api(`/api/conversations/${encodeURIComponent(matchId)}/messages`);
      setMessages((prev) => ({ ...prev, [matchId]: json.messages || [] }));
    } catch (err) {
      // ignore transient fetch errors
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!sessionReady || !currentUser?.id) {
      if (sessionReady) {
        setConversations([]);
        setMessages({});
      }
      return;
    }

    fetchConversations();

    const interval = setInterval(() => {
      fetchConversations();
      if (activeMatchIdRef.current) {
        fetchMessages(activeMatchIdRef.current);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionReady, currentUser?.id, fetchConversations, fetchMessages]);

  const startConversationWithProfile = useCallback(
    (targetProfile: Profile): string => {
      if (!currentUser || !targetProfile?.id) return '';
      const matchId = buildMatchId(currentUser.id, targetProfile.id);
      activeMatchIdRef.current = matchId;

      (async () => {
        try {
          await api('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              partnerId: targetProfile.id,
              message: 'Assalamu Alaikum! I expressed interest in your profile on 2nd Nikha. Looking forward to connecting with you.',
            }),
          });
          await fetchConversations();
          await fetchMessages(matchId);
        } catch (err) {
          // surfaced to UI via empty state
        }
      })();

      return matchId;
    },
    [currentUser, fetchConversations, fetchMessages]
  );

  const sendMessage = useCallback(
    (
      matchIdOrObj: string | { matchId: string; content?: string; text?: string; receiverId?: string; senderId?: string; type?: any; mediaUrl?: string },
      textParam?: string,
      receiverIdOrTypeParam?: string
    ) => {
      if (!currentUser?.id) return;

      let matchId = '';
      let text = '';
      let receiverId = '';
      let type: any = 'TEXT';
      let mediaUrl: string | undefined = undefined;

      if (typeof matchIdOrObj === 'object' && matchIdOrObj !== null) {
        matchId = matchIdOrObj.matchId;
        text = matchIdOrObj.content || matchIdOrObj.text || '';
        receiverId = matchIdOrObj.receiverId || '';
        type = matchIdOrObj.type || 'TEXT';
        mediaUrl = matchIdOrObj.mediaUrl;
      } else {
        matchId = matchIdOrObj as string;
        text = textParam || '';
        if (receiverIdOrTypeParam && ['TEXT', 'IMAGE', 'CONTACT', 'SYSTEM'].includes(receiverIdOrTypeParam)) {
          type = receiverIdOrTypeParam;
        } else if (receiverIdOrTypeParam) {
          receiverId = receiverIdOrTypeParam;
        }
      }

      if (!matchId) return;
      activeMatchIdRef.current = matchId;

      (async () => {
        try {
          const json = await api(`/api/conversations/${encodeURIComponent(matchId)}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: text, receiverId, type, mediaUrl }),
          });
          const saved: Message = json.message;
          setMessages((prev) => {
            const existing = prev[matchId] || [];
            if (existing.some((m) => m.id === saved.id)) return prev;
            return { ...prev, [matchId]: [...existing, saved] };
          });
          fetchConversations();
        } catch (err) {
          // ignore; message not persisted
        }
      })();
    },
    [currentUser?.id, fetchConversations]
  );

  const markAsRead = useCallback(
    (matchId: string) => {
      if (!currentUser?.id || !matchId) return;
      activeMatchIdRef.current = matchId;

      fetchMessages(matchId);

      setConversations((prev) =>
        prev.map((c) =>
          c.matchId === matchId || c.id === matchId ? { ...c, unreadCount: 0 } : c
        )
      );
      setMessages((prev) => {
        const list = prev[matchId];
        if (!list) return prev;
        return {
          ...prev,
          [matchId]: list.map((m) => (m.receiverId === currentUser.id && m.status !== 'READ' ? { ...m, status: 'READ' as const } : m)),
        };
      });

      api(`/api/conversations/${encodeURIComponent(matchId)}/read`, { method: 'POST' }).catch(() => {});
    },
    [currentUser?.id, fetchMessages]
  );

  const editMessage = useCallback(
    (matchId: string, messageId: string, newText: string) => {
      setMessages((prev) => ({
        ...prev,
        [matchId]: (prev[matchId] || []).map((m) => (m.id === messageId ? { ...m, content: newText } : m)),
      }));
      api(`/api/conversations/${encodeURIComponent(matchId)}/messages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, content: newText }),
      }).catch(() => {});
    },
    []
  );

  const deleteMessage = useCallback((matchId: string, messageId: string) => {
    setMessages((prev) => ({
      ...prev,
      [matchId]: (prev[matchId] || []).filter((m) => m.id !== messageId),
    }));
    api(`/api/conversations/${encodeURIComponent(matchId)}/messages?messageId=${encodeURIComponent(messageId)}`, {
      method: 'DELETE',
    }).catch(() => {});
  }, []);

  const requestWhatsAppExchange = useCallback(
    (matchId: string, receiverId: string, recipientName: string) => {
      if (!currentUser?.id || !matchId) return;

      const contactDetails = {
        status: 'PENDING',
        requesterId: currentUser.id,
        requesterName: currentUser.fullName,
        requesterWhatsapp: currentUser.phone || '',
        recipientId: receiverId,
        recipientName: recipientName || 'Member',
        recipientWhatsapp: '',
      };

      activeMatchIdRef.current = matchId;

      (async () => {
        try {
          const json = await api(`/api/conversations/${encodeURIComponent(matchId)}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              receiverId,
              type: 'CONTACT',
              content: `Requested WhatsApp contact exchange with ${(recipientName || 'Member').split(' ')[0]}.`,
              contactDetails,
            }),
          });
          const saved: Message = json.message;
          setMessages((prev) => {
            const existing = prev[matchId] || [];
            if (existing.some((m) => m.id === saved.id)) return prev;
            return { ...prev, [matchId]: [...existing, saved] };
          });
          fetchConversations();
        } catch (err) {
          // ignore
        }
      })();
    },
    [currentUser, fetchConversations]
  );

  const respondToWhatsAppRequest = useCallback(
    (matchId: string, messageId: string, action: 'ACCEPT' | 'DECLINE') => {
      if (!currentUser?.id) return;

      setMessages((prev) => {
        const list = prev[matchId];
        if (!list) return prev;
        return {
          ...prev,
          [matchId]: list.map((m) => {
            if (m.id !== messageId || !m.contactDetails) return m;
            return {
              ...m,
              content:
                action === 'ACCEPT'
                  ? '✓ WhatsApp Contact Exchange Accepted! Numbers shared mutually.'
                  : '❌ WhatsApp Contact Exchange Declined.',
              contactDetails: {
                ...m.contactDetails,
                status: action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED',
              },
            };
          }),
        };
      });

      api(`/api/conversations/${encodeURIComponent(matchId)}/messages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          content:
            action === 'ACCEPT'
              ? '✓ WhatsApp Contact Exchange Accepted! Numbers shared mutually.'
              : '❌ WhatsApp Contact Exchange Declined.',
          contactDetails: { status: action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED' },
        }),
      }).catch(() => {});
    },
    [currentUser?.id]
  );

  const shareContactInChat = useCallback(
    (matchId: string, receiverId: string, details: { phone?: string; whatsapp?: string; email?: string }) => {
      const targetName = (details as any)?.recipientName || 'Member';
      requestWhatsAppExchange(matchId, receiverId, targetName);
    },
    [requestWhatsAppExchange]
  );

  const sharePhotoInChat = useCallback(
    (matchId: string, photoUrl: string, receiverIdOrCaption?: string, caption?: string) => {
      let receiverId = '';
      let textCaption = '';

      if (caption) {
        receiverId = receiverIdOrCaption || '';
        textCaption = caption;
      } else {
        textCaption = receiverIdOrCaption || 'Shared a photo 📷';
      }

      sendMessage({
        matchId,
        receiverId,
        content: textCaption,
        type: 'IMAGE',
        mediaUrl: photoUrl,
      });
    },
    [sendMessage]
  );

  const deletePhoto = useCallback((matchId: string, photoId: string) => {
    deleteMessage(matchId, photoId);
  }, [deleteMessage]);

  const sharedPhotos = useMemo(() => {
    const map: Record<string, SharedPhoto[]> = {};
    for (const [matchId, list] of Object.entries(messages)) {
      map[matchId] = (list || [])
        .filter((m) => m.type === 'IMAGE' && m.mediaUrl)
        .map((m) => ({
          id: m.id,
          matchId,
          senderId: m.senderId,
          url: m.mediaUrl as string,
          createdAt: m.createdAt,
          privacy: 'MATCH_ONLY' as const,
        }));
    }
    return map;
  }, [messages]);

  const toggleBlockConversation = useCallback(
    (matchId: string) => {
      if (!currentUser?.id || !matchId) return;
      api(`/api/conversations/${encodeURIComponent(matchId)}/block`, { method: 'POST' })
        .then(() => fetchConversations())
        .catch(() => {});
    },
    [currentUser?.id, fetchConversations]
  );

  const deleteConversation = useCallback(
    (matchId: string) => {
      setConversations((prev) => prev.filter((c) => c.matchId !== matchId && c.id !== matchId));
      setMessages((prev) => {
        const updated = { ...prev };
        delete updated[matchId];
        return updated;
      });
      api(`/api/conversations/${encodeURIComponent(matchId)}`, { method: 'DELETE' }).catch(() => {});
    },
    []
  );

  const totalUnreadCount = useMemo(
    () => conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    [conversations]
  );

  return (
    <CommunicationContext.Provider
      value={{
        conversations,
        messages,
        sharedPhotos,
        totalUnreadCount,
        sendMessage,
        editMessage,
        deleteMessage,
        shareContactInChat,
        sharePhotoInChat,
        deletePhoto,
        markAsRead,
        startConversationWithProfile,
        requestWhatsAppExchange,
        respondToWhatsAppRequest,
        toggleBlockConversation,
        deleteConversation,
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

export function useCommunication() {
  return useContext(CommunicationContext);
}

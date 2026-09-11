'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Conversation, Message, SharedPhoto, Profile } from '@/types';
import { MOCK_PROFILES } from '@/data/mock-data';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/admin-context';

const STORAGE_KEY_MESSAGES = '2ndchance_chat_messages';
const STORAGE_KEY_CONVERSATIONS = '2ndchance_chat_conversations';
const STORAGE_KEY_SHARED_PHOTOS = '2ndchance_chat_shared_photos';

export function buildMatchId(id1: string, id2: string): string {
  if (!id1 || !id2) return id1 || id2 || 'match-default';
  // Standardized symmetric match key for any 2 users
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

  // 1. Exact ID / Email / Phone / FullName match
  const exact = profiles.find((p) => {
    const pId = p.id?.trim().toLowerCase();
    const pEmail = p.email?.trim().toLowerCase();
    const pPhone = p.phone?.trim().toLowerCase();
    const pName = p.fullName?.trim().toLowerCase();

    return (
      (Boolean(pId) && pId === target) ||
      (Boolean(pEmail) && pEmail === target) ||
      (Boolean(pPhone) && pPhone === target) ||
      (Boolean(pName) && pName === target)
    );
  });
  if (exact) return exact;

  // 2. Contains / Fuzzy match (for generated IDs or email prefixes)
  return profiles.find((p) => {
    const pId = p.id?.trim().toLowerCase() || '';
    const pEmail = p.email?.trim().toLowerCase() || '';
    const pName = p.fullName?.trim().toLowerCase() || '';

    return (
      (Boolean(pId) && (target.includes(pId) || pId.includes(target))) ||
      (Boolean(pEmail) && (target.includes(pEmail) || pEmail.includes(target))) ||
      (Boolean(pName) && (target.includes(pName) || pName.includes(target)))
    );
  });
}

export function CommunicationProvider({ children }: { children: React.ReactNode }) {
  const [rawConversations, setRawConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [sharedPhotos, setSharedPhotos] = useState<Record<string, SharedPhoto[]>>({});

  const { currentUser: authUser } = useAuth();
  const currentUser = authUser || MOCK_PROFILES[0];

  let adminMembers: Profile[] = [];
  try {
    const admin = useAdmin();
    if (admin?.members && admin.members.length > 0) {
      adminMembers = admin.members;
    }
  } catch (e) {}

  const allProfiles = useMemo(() => {
    const combined: Profile[] = [...adminMembers];

    const addIfNew = (p: Profile | null | undefined) => {
      if (!p || !p.id) return;
      if (!combined.some((item) => item.id === p.id || (item.email && p.email && item.email.toLowerCase() === p.email.toLowerCase()))) {
        combined.push(p);
      }
    };

    if (currentUser) addIfNew(currentUser);

    for (const mock of MOCK_PROFILES) {
      addIfNew(mock);
    }

    if (typeof window !== 'undefined') {
      try {
        const checkoutCust = localStorage.getItem('2ndchance_checkout_customer');
        if (checkoutCust) addIfNew(JSON.parse(checkoutCust));

        const regAccs = localStorage.getItem('2ndchance_registered_accounts');
        if (regAccs) {
          const list = JSON.parse(regAccs);
          if (Array.isArray(list)) list.forEach(addIfNew);
        }

        const adminM = localStorage.getItem('2ndchance_admin_members');
        if (adminM) {
          const list = JSON.parse(adminM);
          if (Array.isArray(list)) list.forEach(addIfNew);
        }
      } catch (e) {}
    }

    return combined;
  }, [adminMembers, currentUser]);

  const lastSyncCache = useRef({ msgs: '', convs: '', photos: '' });

  // Load and synchronize state from localStorage with cross-tab / multi-tab support
  const syncFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES) || '';
      const savedConversations = localStorage.getItem(STORAGE_KEY_CONVERSATIONS) || '';
      const savedPhotos = localStorage.getItem(STORAGE_KEY_SHARED_PHOTOS) || '';

      if (savedMessages && savedMessages !== lastSyncCache.current.msgs) {
        lastSyncCache.current.msgs = savedMessages;
        setMessages(JSON.parse(savedMessages));
      }
      if (savedConversations && savedConversations !== lastSyncCache.current.convs) {
        lastSyncCache.current.convs = savedConversations;
        const parsed = JSON.parse(savedConversations);
        if (Array.isArray(parsed)) {
          const sanitized = parsed.map((c: Conversation) => {
            let participantIds = c.participantIds || [];
            if (participantIds.length < 2 && c.matchId) {
              const matchParts = c.matchId.replace(/^match[-_]/, '').split('_');
              if (matchParts.length >= 2) {
                participantIds = [matchParts[0], matchParts[1]];
              } else if (c.partnerId && c.lastSenderId) {
                participantIds = Array.from(new Set([c.partnerId, c.lastSenderId]));
              }
            }
            return {
              ...c,
              participantIds,
            };
          });
          setRawConversations(sanitized);
        }
      }
      if (savedPhotos && savedPhotos !== lastSyncCache.current.photos) {
        lastSyncCache.current.photos = savedPhotos;
        setSharedPhotos(JSON.parse(savedPhotos));
      }
    } catch (err) {
      console.error('Failed to sync chat history from localStorage:', err);
    }
  }, []);

  useEffect(() => {
    syncFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', syncFromStorage);
      const interval = setInterval(syncFromStorage, 1000);
      return () => {
        window.removeEventListener('storage', syncFromStorage);
        clearInterval(interval);
      };
    }
  }, [syncFromStorage]);

  // Start realistic conversation between currentUser and target Profile
  const startConversationWithProfile = useCallback(
    (targetProfile: Profile): string => {
      if (!currentUser || !targetProfile) return '';

      const matchId = buildMatchId(currentUser.id, targetProfile.id);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setRawConversations((prevConvs) => {
        const existing = prevConvs.find((c) => c.matchId === matchId);
        if (existing) return prevConvs;

        const newConv: Conversation = {
          id: `conv-${matchId}`,
          matchId: matchId,
          partnerId: targetProfile.id,
          participantIds: [currentUser.id, targetProfile.id],
          lastMessage: `Assalamu Alaikum! I expressed interest in your profile.`,
          lastMessageAt: timeStr,
          lastSenderId: currentUser.id,
          unreadCount: 0,
          unreadCounts: { [currentUser.id]: 0, [targetProfile.id]: 1 },
          status: 'ACTIVE',
          profile: targetProfile,
        };

        const updatedConvs = [newConv, ...prevConvs];
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updatedConvs));
          } catch (e) {}
        }
        return updatedConvs;
      });

      setMessages((prevMsgs) => {
        if (prevMsgs[matchId] && prevMsgs[matchId].length > 0) {
          return prevMsgs;
        }

        const initialGreetingMsg: Message = {
          id: `msg-${Date.now()}`,
          matchId: matchId,
          senderId: currentUser.id,
          receiverId: targetProfile.id,
          content: `Assalamu Alaikum! I expressed interest in your profile on 2nd Nikha. Looking forward to connecting with you.`,
          type: 'TEXT',
          status: 'SENT',
          createdAt: timeStr,
        };

        const updatedMsgs = {
          ...prevMsgs,
          [matchId]: [initialGreetingMsg],
        };

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgs));
          } catch (e) {}
        }
        return updatedMsgs;
      });

      return matchId;
    },
    [currentUser]
  );

  // Send Message (Text or Image or Contact)
  const sendMessage = useCallback(
    (
      matchIdOrObj: string | { matchId: string; content?: string; text?: string; receiverId?: string; senderId?: string; type?: any; mediaUrl?: string },
      textParam?: string,
      receiverIdOrTypeParam?: string
    ) => {
      if (!currentUser) return;

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

      // Find conversation to resolve receiverId if missing
      const targetConv = rawConversations.find((c) => c.matchId === matchId || c.id === matchId);
      if (targetConv && targetConv.status === 'BLOCKED') {
        console.warn('Cannot send message in a blocked conversation.');
        return;
      }
      if (!receiverId && targetConv && targetConv.participantIds) {
        receiverId = targetConv.participantIds.find((id) => !isSameUser(id, currentUser)) || '';
      }
      if (!receiverId && targetConv && targetConv.partnerId && !isSameUser(targetConv.partnerId, currentUser)) {
        receiverId = targetConv.partnerId;
      }
      if (!receiverId && matchId) {
        const parts = matchId.replace(/^match[-_]/, '').split('_');
        receiverId = parts.find((p) => !isSameUser(p, currentUser)) || '';
      }

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        matchId,
        senderId: currentUser.id,
        receiverId: receiverId || 'unknown',
        content: text.trim() || (type === 'IMAGE' ? 'Shared a photo 📷' : ''),
        type,
        mediaUrl,
        status: 'SENT',
        createdAt: timeStr,
      };

      setMessages((prevMsgs) => {
        const existingList = prevMsgs[matchId] || [];
        const updatedMsgs = {
          ...prevMsgs,
          [matchId]: [...existingList, newMsg],
        };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgs));
          } catch (e) {}
        }
        return updatedMsgs;
      });

      setRawConversations((prevConvs) => {
        const targetIdx = prevConvs.findIndex((c) => c.matchId === matchId || c.id === matchId);
        const lastMsgText = type === 'IMAGE' ? (text.trim() ? `📷 ${text.trim()}` : 'Shared a photo 📷') : text.trim();

        if (targetIdx !== -1) {
          const conv = prevConvs[targetIdx];
          const recId = receiverId || conv.participantIds?.find((id) => !isSameUser(id, currentUser)) || conv.partnerId || 'unknown';
          const unreadCounts = { ...(conv.unreadCounts || {}) };
          unreadCounts[recId] = (unreadCounts[recId] || 0) + 1;
          unreadCounts[currentUser.id] = 0;

          const updatedConv: Conversation = {
            ...conv,
            lastMessage: lastMsgText,
            lastMessageAt: timeStr,
            lastSenderId: currentUser.id,
            unreadCounts,
            participantIds:
              conv.participantIds && conv.participantIds.length >= 2
                ? conv.participantIds
                : [currentUser.id, recId],
          };

          const updatedConvs = [updatedConv, ...prevConvs.filter((_, idx) => idx !== targetIdx)];
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updatedConvs));
            } catch (e) {}
          }
          return updatedConvs;
        } else {
          // Create new conversation if not found
          const recId = receiverId || 'unknown';
          const partnerProf = findProfileByIdOrEmail(recId, allProfiles) || MOCK_PROFILES[0];
          const newConv: Conversation = {
            id: `conv-${matchId}`,
            matchId,
            partnerId: recId,
            participantIds: [currentUser.id, recId],
            lastMessage: lastMsgText,
            lastMessageAt: timeStr,
            lastSenderId: currentUser.id,
            unreadCount: 1,
            unreadCounts: { [currentUser.id]: 0, [recId]: 1 },
            status: 'ACTIVE',
            profile: partnerProf,
          };

          const updatedConvs = [newConv, ...prevConvs];
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updatedConvs));
            } catch (e) {}
          }
          return updatedConvs;
        }
      });
    },
    [currentUser, rawConversations, allProfiles]
  );

  const markAsRead = useCallback(
    (matchId: string) => {
      if (!currentUser) return;

      setRawConversations((prevConvs) => {
        let changed = false;
        const updated = prevConvs.map((c) => {
          if (c.matchId === matchId || c.id === matchId) {
            const currentUnread = c.unreadCounts?.[currentUser.id] || (c.partnerId === currentUser.id ? c.unreadCount : 0);
            if (currentUnread > 0 || c.unreadCount > 0) {
              changed = true;
              const unreadCounts = { ...(c.unreadCounts || {}) };
              unreadCounts[currentUser.id] = 0;
              return { ...c, unreadCount: 0, unreadCounts };
            }
          }
          return c;
        });

        if (changed && typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updated));
          } catch (e) {}
        }
        return changed ? updated : prevConvs;
      });

      setMessages((prevMsgs) => {
        const msgs = prevMsgs[matchId];
        if (!msgs || msgs.length === 0) return prevMsgs;

        let changed = false;
        const updatedMsgsList = msgs.map((m) => {
          if (m.receiverId === currentUser.id && m.status !== 'READ') {
            changed = true;
            return { ...m, status: 'READ' as const };
          }
          return m;
        });

        if (!changed) return prevMsgs;

        const updatedMsgsMap = {
          ...prevMsgs,
          [matchId]: updatedMsgsList,
        };

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgsMap));
          } catch (e) {}
        }
        return updatedMsgsMap;
      });
    },
    [currentUser]
  );

  const editMessage = useCallback((matchId: string, messageId: string, newText: string) => {
    setMessages((prevMsgs) => {
      const updatedMsgs = {
        ...prevMsgs,
        [matchId]: (prevMsgs[matchId] || []).map((m) =>
          m.id === messageId ? { ...m, content: newText } : m
        ),
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgs));
        } catch (e) {}
      }
      return updatedMsgs;
    });
  }, []);

  const deleteMessage = useCallback((matchId: string, messageId: string) => {
    setMessages((prevMsgs) => {
      const updatedMsgs = {
        ...prevMsgs,
        [matchId]: (prevMsgs[matchId] || []).filter((m) => m.id !== messageId),
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgs));
        } catch (e) {}
      }
      return updatedMsgs;
    });
  }, []);

  const requestWhatsAppExchange = useCallback(
    (matchId: string, receiverId: string, recipientName: string) => {
      if (!currentUser) return;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Resolve requester and recipient WhatsApp numbers
      const requesterWhatsapp =
        currentUser.phone ||
        `+880 1712-${Math.floor(100000 + Math.random() * 900000)}`;

      const recProfile = allProfiles.find((p) => p.id === receiverId) || { fullName: recipientName };
      const recipientWhatsapp =
        (recProfile as any).phone ||
        `+880 1819-${Math.floor(100000 + Math.random() * 900000)}`;

      const newMsg: Message = {
        id: `msg-wa-${Date.now()}`,
        matchId,
        senderId: currentUser.id,
        receiverId,
        content: `Requested WhatsApp contact exchange with ${recipientName.split(' ')[0]}.`,
        type: 'CONTACT',
        status: 'SENT',
        createdAt: timeStr,
        contactDetails: {
          status: 'PENDING',
          requesterId: currentUser.id,
          requesterName: currentUser.fullName,
          requesterWhatsapp,
          recipientId: receiverId,
          recipientName: recipientName || (recProfile as any).fullName || 'Member',
          recipientWhatsapp,
        },
      };

      setMessages((prevMsgs) => {
        const existingList = prevMsgs[matchId] || [];
        const updatedMsgs = {
          ...prevMsgs,
          [matchId]: [...existingList, newMsg],
        };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgs));
          } catch (e) {}
        }
        return updatedMsgs;
      });

      setRawConversations((prevConvs) => {
        const targetIdx = prevConvs.findIndex((c) => c.matchId === matchId || c.id === matchId);
        const lastMsgText = '💬 Requested WhatsApp Contact Exchange';

        if (targetIdx !== -1) {
          const conv = prevConvs[targetIdx];
          const recId = receiverId || conv.participantIds?.find((id) => id !== currentUser.id) || 'unknown';
          const unreadCounts = { ...(conv.unreadCounts || {}) };
          unreadCounts[recId] = (unreadCounts[recId] || 0) + 1;
          unreadCounts[currentUser.id] = 0;

          const updatedConv: Conversation = {
            ...conv,
            lastMessage: lastMsgText,
            lastMessageAt: timeStr,
            unreadCounts,
          };

          const updatedConvs = [updatedConv, ...prevConvs.filter((_, idx) => idx !== targetIdx)];
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updatedConvs));
            } catch (e) {}
          }
          return updatedConvs;
        }
        return prevConvs;
      });
    },
    [currentUser, allProfiles]
  );

  const respondToWhatsAppRequest = useCallback(
    (matchId: string, messageId: string, action: 'ACCEPT' | 'DECLINE') => {
      if (!currentUser) return;

      setMessages((prevMsgs) => {
        const msgs = prevMsgs[matchId];
        if (!msgs) return prevMsgs;

        const updatedList = msgs.map((m) => {
          if (m.id === messageId && m.contactDetails) {
            const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';
            const newContent =
              action === 'ACCEPT'
                ? '✓ WhatsApp Contact Exchange Accepted! Numbers shared mutually.'
                : '❌ WhatsApp Contact Exchange Declined.';

            return {
              ...m,
              content: newContent,
              contactDetails: {
                ...m.contactDetails,
                status: newStatus as any,
              },
            };
          }
          return m;
        });

        const updatedMsgsMap = {
          ...prevMsgs,
          [matchId]: updatedList,
        };

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgsMap));
          } catch (e) {}
        }
        return updatedMsgsMap;
      });

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setRawConversations((prevConvs) => {
        const updated = prevConvs.map((c) => {
          if (c.matchId === matchId || c.id === matchId) {
            const recId = c.participantIds?.find((id) => id !== currentUser.id) || c.partnerId || 'unknown';
            const unreadCounts = { ...(c.unreadCounts || {}) };
            unreadCounts[recId] = (unreadCounts[recId] || 0) + 1;
            unreadCounts[currentUser.id] = 0;

            return {
              ...c,
              lastMessage: action === 'ACCEPT' ? '✓ WhatsApp Exchange Accepted' : 'WhatsApp Request Declined',
              lastMessageAt: timeStr,
              unreadCounts,
            };
          }
          return c;
        });

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updated));
          } catch (e) {}
        }
        return updated;
      });
    },
    [currentUser]
  );

  const shareContactInChat = useCallback(
    (matchId: string, receiverId: string, details: { phone?: string; whatsapp?: string; email?: string }) => {
      if (!currentUser) return;
      const targetName = (details as any)?.recipientName || 'Member';
      requestWhatsAppExchange(matchId, receiverId, targetName);
    },
    [currentUser, requestWhatsAppExchange]
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

      const newPhoto: SharedPhoto = {
        id: `sp-${Date.now()}`,
        matchId,
        senderId: currentUser.id,
        url: photoUrl,
        createdAt: 'Today',
        privacy: 'MATCH_ONLY',
      };

      setSharedPhotos((prevPhotos) => {
        const updatedPhotos = {
          ...prevPhotos,
          [matchId]: [...(prevPhotos[matchId] || []), newPhoto],
        };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_SHARED_PHOTOS, JSON.stringify(updatedPhotos));
          } catch (e) {}
        }
        return updatedPhotos;
      });
    },
    [currentUser, sendMessage]
  );

  const deletePhoto = useCallback((matchId: string, photoId: string) => {
    setSharedPhotos((prevPhotos) => {
      const updatedPhotos = {
        ...prevPhotos,
        [matchId]: (prevPhotos[matchId] || []).filter((p) => p.id !== photoId),
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_SHARED_PHOTOS, JSON.stringify(updatedPhotos));
        } catch (e) {}
      }
      return updatedPhotos;
    });
  }, []);

  const isSameUser = useCallback((profileOrId: Profile | string | undefined | null, targetUser: Profile | null): boolean => {
    if (!targetUser || !profileOrId) return false;
    const targetId = targetUser.id?.toLowerCase();
    const targetEmail = targetUser.email?.toLowerCase();
    const targetName = targetUser.fullName?.toLowerCase();

    if (typeof profileOrId === 'string') {
      const clean = profileOrId.trim().toLowerCase();
      if (!clean) return false;
      return clean === targetId || (targetEmail && clean === targetEmail) || (targetName && clean === targetName);
    }

    const pId = profileOrId.id?.toLowerCase();
    const pEmail = profileOrId.email?.toLowerCase();
    const pName = profileOrId.fullName?.toLowerCase();

    return (
      (Boolean(pId) && pId === targetId) ||
      (Boolean(pEmail) && Boolean(targetEmail) && pEmail === targetEmail) ||
      (Boolean(pName) && Boolean(targetName) && pName === targetName)
    );
  }, []);

  // Dynamically resolve conversations for the current logged-in user
  const userConversations: Conversation[] = useMemo(() => {
    if (!currentUser) return [];

    return rawConversations
      .filter((c) => {
        if (!c) return false;
        // Check if current user is part of this conversation
        if (c.participantIds && c.participantIds.length > 0) {
          return c.participantIds.some((id) => isSameUser(id, currentUser));
        }
        if (c.matchId) {
          const matchClean = c.matchId.toLowerCase();
          const userIdClean = currentUser.id?.toLowerCase() || '';
          const userEmailClean = currentUser.email?.toLowerCase() || '';
          return (
            (Boolean(userIdClean) && matchClean.includes(userIdClean)) ||
            (Boolean(userEmailClean) && matchClean.includes(userEmailClean))
          );
        }
        return false;
      })
      .map((c) => {
        // Find the partner ID string (the participant in c.participantIds that is NOT currentUser)
        let partnerIdStr = '';
        if (c.participantIds && c.participantIds.length > 0) {
          partnerIdStr = c.participantIds.find((id) => !isSameUser(id, currentUser)) || '';
        }

        if (!partnerIdStr && c.partnerId && !isSameUser(c.partnerId, currentUser)) {
          partnerIdStr = c.partnerId;
        }

        if (!partnerIdStr && c.matchId) {
          const matchParts = c.matchId.replace(/^match[-_]/, '').split('_');
          const nonCurrent = matchParts.find((part) => !isSameUser(part, currentUser));
          if (nonCurrent) partnerIdStr = nonCurrent;
        }

        // Strictly look up partner profile in allProfiles
        let partnerProfile = findProfileByIdOrEmail(partnerIdStr, allProfiles);

        // If not found by partnerIdStr directly, search allProfiles for any profile matching matchId or participantIds that is NOT currentUser
        if (!partnerProfile) {
          partnerProfile = allProfiles.find((p) => {
            if (isSameUser(p, currentUser)) return false;
            if (c.participantIds && c.participantIds.some((id) => isSameUser(id, p))) return true;
            if (c.matchId && (c.matchId.includes(p.id) || (p.email && c.matchId.includes(p.email)))) return true;
            return false;
          });
        }

        // If still not found, check messages in c.matchId for contactDetails (requesterName or recipientName)
        if (!partnerProfile && messages && messages[c.matchId]) {
          const roomMsgs = messages[c.matchId];
          for (const m of roomMsgs) {
            if (m.contactDetails) {
              const cd = m.contactDetails;
              let targetName = '';
              if (cd.requesterId && !isSameUser(cd.requesterId, currentUser) && cd.requesterName) {
                targetName = cd.requesterName;
              } else if (cd.recipientId && !isSameUser(cd.recipientId, currentUser) && cd.recipientName) {
                targetName = cd.recipientName;
              }

              if (targetName) {
                const foundByName = allProfiles.find((p) => isSameUser(p.fullName, { id: '', fullName: targetName } as any));
                if (foundByName) {
                  partnerProfile = foundByName;
                  break;
                } else {
                  partnerProfile = {
                    id: partnerIdStr || `partner-${Date.now()}`,
                    fullName: targetName,
                    age: 30,
                    gender: 'Female',
                    maritalStatus: 'Divorced',
                    hasChildren: false,
                    height: "5'5\"",
                    religion: 'Islam',
                    education: 'Graduate',
                    profession: 'Verified Member',
                    location: 'Dhaka, Bangladesh',
                    city: 'Dhaka',
                    country: 'Bangladesh',
                    photoUrl: '/images/default-avatar.jpg',
                    photoPrivacy: 'PUBLIC',
                    isVerified: true,
                    matchPercentage: 92,
                    matchReasons: ['Verified Member'],
                    bio: 'Member profile on 2nd Nikha.',
                    partnerPreferences: { ageRange: '25 - 40', maritalStatuses: ['Divorced'], religion: 'Islam', minHeight: "5'2\"", education: 'Graduate', location: 'Dhaka' },
                    trustScore: 95,
                    membershipTier: 'Free',
                    createdAt: new Date().toISOString(),
                  };
                  break;
                }
              }
            }
          }
        }

        // If still not found, construct a dynamic fallback profile with a clean human-readable name instead of raw UUID strings
        if (!partnerProfile) {
          let displayName = 'Candidate Member';
          if (partnerIdStr && !partnerIdStr.startsWith('p-') && !partnerIdStr.startsWith('user-') && !partnerIdStr.includes('-') && !/^\d+$/.test(partnerIdStr)) {
            displayName = partnerIdStr.split('@')[0].replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          }

          partnerProfile = {
            id: partnerIdStr || `partner-${Date.now()}`,
            fullName: displayName,
            age: 30,
            gender: 'Female',
            maritalStatus: 'Divorced',
            hasChildren: false,
            height: "5'5\"",
            religion: 'Islam',
            education: 'Graduate',
            profession: 'Verified Member',
            location: 'Dhaka, Bangladesh',
            city: 'Dhaka',
            country: 'Bangladesh',
            photoUrl: '/images/default-avatar.jpg',
            photoPrivacy: 'PUBLIC',
            isVerified: true,
            matchPercentage: 92,
            matchReasons: ['Verified Member'],
            bio: 'Member profile on 2nd Nikha.',
            partnerPreferences: {
              ageRange: '25 - 40',
              maritalStatuses: ['Divorced'],
              religion: 'Islam',
              minHeight: "5'2\"",
              education: 'Graduate',
              location: 'Dhaka',
            },
            trustScore: 95,
            membershipTier: 'Free',
            createdAt: new Date().toISOString(),
          };
        }

        const unreadCount = c.unreadCounts
          ? c.unreadCounts[currentUser.id] || c.unreadCounts[currentUser.email || ''] || 0
          : 0;

        return {
          ...c,
          partnerId: partnerProfile.id,
          profile: partnerProfile,
          unreadCount,
        };
      });
  }, [rawConversations, currentUser, allProfiles]);

  const toggleBlockConversation = useCallback(
    (matchId: string) => {
      if (!currentUser) return;

      setRawConversations((prevConvs) => {
        const updated = prevConvs.map((c) => {
          if (c.matchId === matchId || c.id === matchId) {
            const isCurrentlyBlocked = c.status === 'BLOCKED';

            if (isCurrentlyBlocked) {
              const isBlocker = isSameUser(c.blockedBy, currentUser);
              if (!isBlocker) {
                console.warn('Only the member who initiated the block can unblock this conversation.');
                return c;
              }
              return {
                ...c,
                status: 'ACTIVE' as const,
                blockedBy: undefined,
              };
            } else {
              return {
                ...c,
                status: 'BLOCKED' as const,
                blockedBy: currentUser.id,
              };
            }
          }
          return c;
        });

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updated));
          } catch (e) {}
        }
        return updated;
      });
    },
    [currentUser]
  );

  const deleteConversation = useCallback(
    (matchId: string) => {
      setRawConversations((prevConvs) => {
        const updated = prevConvs.filter((c) => c.matchId !== matchId && c.id !== matchId);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updated));
          } catch (e) {}
        }
        return updated;
      });

      setMessages((prevMsgs) => {
        const updated = { ...prevMsgs };
        delete updated[matchId];
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updated));
          } catch (e) {}
        }
        return updated;
      });
    },
    []
  );

  const totalUnreadCount = useMemo(() => {
    return userConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [userConversations]);

  return (
    <CommunicationContext.Provider
      value={{
        conversations: userConversations,
        messages: messages || {},
        sharedPhotos: sharedPhotos || {},
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

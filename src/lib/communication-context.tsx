'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Conversation, Message, SharedPhoto, Profile } from '@/types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_SHARED_PHOTOS } from '@/data/message-data';
import { MOCK_PROFILES } from '@/data/mock-data';
import { useAuth } from '@/lib/auth-context';

const STORAGE_KEY_MESSAGES = '2ndchance_chat_messages';
const STORAGE_KEY_CONVERSATIONS = '2ndchance_chat_conversations';
const STORAGE_KEY_SHARED_PHOTOS = '2ndchance_chat_shared_photos';

interface CommunicationContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sharedPhotos: Record<string, SharedPhoto[]>;
  totalUnreadCount: number;
  sendMessage: (
    matchIdOrObj: string | { matchId: string; content?: string; text?: string; receiverId: string; senderId?: string; type?: any },
    text?: string,
    receiverId?: string
  ) => void;
  editMessage: (matchId: string, messageId: string, newText: string) => void;
  deleteMessage: (matchId: string, messageId: string) => void;
  shareContactInChat: (matchId: string, receiverId: string, details: { phone?: string; whatsapp?: string; email?: string }) => void;
  sharePhotoInChat: (matchId: string, photoUrl: string, receiverId: string) => void;
  deletePhoto: (matchId: string, photoId: string) => void;
  markAsRead: (matchId: string) => void;
  startConversationWithProfile: (profile: Profile) => string;
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
});

export function CommunicationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [sharedPhotos, setSharedPhotos] = useState<Record<string, SharedPhoto[]>>({});

  const { currentUser: authUser } = useAuth();
  const currentUser = authUser || MOCK_PROFILES[0];

  // Hydrate state from localStorage on initial client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
        const savedConversations = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
        const savedPhotos = localStorage.getItem(STORAGE_KEY_SHARED_PHOTOS);

        if (savedMessages) setMessages(JSON.parse(savedMessages));
        if (savedConversations) {
          const parsed = JSON.parse(savedConversations);
          if (Array.isArray(parsed)) {
            const hydrated = parsed.map((c: Conversation) => {
              if (!c.profile) {
                const foundProfile =
                  MOCK_PROFILES.find(
                    (p) => p.id === c.partnerId || `match-${p.id}` === c.matchId || `conv-${p.id}` === c.id
                  ) || MOCK_PROFILES[1];
                return { ...c, profile: foundProfile };
              }
              return c;
            });
            setConversations(hydrated);
          }
        }
        if (savedPhotos) setSharedPhotos(JSON.parse(savedPhotos));
      } catch (err) {
        console.error('Failed to load chat history from localStorage:', err);
      }
    }
  }, []);

  // Safe markAsRead with zero state mutation if already read
  const markAsRead = useCallback((matchId: string) => {
    setConversations((prevConvs) => {
      const target = prevConvs.find((c) => c.matchId === matchId);
      if (!target || target.unreadCount === 0) {
        return prevConvs;
      }

      const updated = prevConvs.map((c) =>
        c.matchId === matchId ? { ...c, unreadCount: 0 } : c
      );

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  }, []);

  // Start realistic conversation with ANY profile from AI Match
  const startConversationWithProfile = useCallback((profile: Profile): string => {
    const targetMatchId = `match-${profile.id}`;

    setConversations((prevConvs) => {
      const existing = prevConvs.find((c) => c.matchId === targetMatchId || c.partnerId === profile.id);
      if (existing) return prevConvs;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newConv: Conversation = {
        id: `conv-${profile.id}`,
        matchId: targetMatchId,
        partnerId: profile.id,
        profile: profile,
        lastMessage: `Assalamu Alaikum! I expressed interest in your profile.`,
        lastMessageAt: timeStr,
        unreadCount: 0,
        participantIds: ['p-101', profile.id],
        status: 'ACTIVE',
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
      if (prevMsgs[targetMatchId] && prevMsgs[targetMatchId].length > 0) {
        return prevMsgs;
      }

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const initialGreetingMsg: Message = {
        id: `msg-${Date.now()}`,
        matchId: targetMatchId,
        senderId: currentUser.id,
        receiverId: profile.id,
        content: `Assalamu Alaikum! I expressed interest in your profile on 2nd Chance. Looking forward to connecting with you.`,
        type: 'TEXT',
        status: 'SENT',
        createdAt: timeStr,
      };

      const updatedMsgs = {
        ...prevMsgs,
        [targetMatchId]: [initialGreetingMsg],
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgs));
        } catch (e) {}
      }
      return updatedMsgs;
    });

    return targetMatchId;
  }, [currentUser.id]);

  const sendMessage = useCallback(
    (
      matchIdOrObj: string | { matchId: string; content?: string; text?: string; receiverId: string; senderId?: string; type?: any },
      textParam?: string,
      receiverIdParam?: string
    ) => {
      let matchId = '';
      let text = '';
      let receiverId = '';

      if (typeof matchIdOrObj === 'object' && matchIdOrObj !== null) {
        matchId = matchIdOrObj.matchId;
        text = matchIdOrObj.content || matchIdOrObj.text || '';
        receiverId = matchIdOrObj.receiverId;
      } else {
        matchId = matchIdOrObj as string;
        text = textParam || '';
        receiverId = receiverIdParam || 'p-102';
      }

      if (!matchId || !text.trim()) return;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        matchId,
        senderId: currentUser.id,
        receiverId,
        content: text.trim(),
        type: 'TEXT',
        status: 'SENT',
        createdAt: timeStr,
      };

      setMessages((prevMsgs) => {
        const updatedMsgs = {
          ...prevMsgs,
          [matchId]: [...(prevMsgs[matchId] || []), newMsg],
        };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgs));
          } catch (e) {}
        }
        return updatedMsgs;
      });

      setConversations((prevConvs) => {
        const updatedConvs = prevConvs.map((c) =>
          c.matchId === matchId
            ? { ...c, lastMessage: text.trim(), lastMessageAt: timeStr, unreadCount: 0 }
            : c
        );
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updatedConvs));
          } catch (e) {}
        }
        return updatedConvs;
      });
    },
    [currentUser.id]
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

  const shareContactInChat = useCallback(
    (matchId: string, receiverId: string, details: { phone?: string; whatsapp?: string; email?: string }) => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        matchId,
        senderId: currentUser.id,
        receiverId,
        content: 'Shared verified contact details.',
        type: 'CONTACT',
        status: 'SENT',
        createdAt: timeStr,
        contactDetails: details,
      };

      setMessages((prevMsgs) => {
        const updatedMsgs = {
          ...prevMsgs,
          [matchId]: [...(prevMsgs[matchId] || []), newMsg],
        };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgs));
          } catch (e) {}
        }
        return updatedMsgs;
      });

      setConversations((prevConvs) => {
        const updatedConvs = prevConvs.map((c) =>
          c.matchId === matchId
            ? { ...c, lastMessage: 'Shared contact details 📞', lastMessageAt: timeStr, unreadCount: 0 }
            : c
        );
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updatedConvs));
          } catch (e) {}
        }
        return updatedConvs;
      });
    },
    [currentUser.id]
  );

  const sharePhotoInChat = useCallback(
    (matchId: string, photoUrl: string, receiverId: string) => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newPhoto: SharedPhoto = {
        id: `sp-${Date.now()}`,
        matchId,
        senderId: currentUser.id,
        url: photoUrl,
        createdAt: 'Today',
        privacy: 'MATCH_ONLY',
      };

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        matchId,
        senderId: currentUser.id,
        receiverId,
        content: 'Shared a photo',
        type: 'IMAGE',
        status: 'SENT',
        createdAt: timeStr,
        mediaUrl: photoUrl,
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

      setMessages((prevMsgs) => {
        const updatedMsgs = {
          ...prevMsgs,
          [matchId]: [...(prevMsgs[matchId] || []), newMsg],
        };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(updatedMsgs));
          } catch (e) {}
        }
        return updatedMsgs;
      });

      setConversations((prevConvs) => {
        const updatedConvs = prevConvs.map((c) =>
          c.matchId === matchId
            ? { ...c, lastMessage: 'Shared a photo 📷', lastMessageAt: timeStr, unreadCount: 0 }
            : c
        );
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updatedConvs));
          } catch (e) {}
        }
        return updatedConvs;
      });
    },
    [currentUser.id]
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

  const totalUnreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <CommunicationContext.Provider
      value={{
        conversations: Array.isArray(conversations) ? conversations : [],
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
      }}
    >
      {children}
    </CommunicationContext.Provider>
  );
}

export function useCommunication() {
  return useContext(CommunicationContext);
}

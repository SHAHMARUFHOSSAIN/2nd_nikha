'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { MemberLayout } from '@/components/member/member-layout';
import { useCommunication } from '@/lib/communication-context';
import { useConnection } from '@/lib/connection-context';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  MessageCircle,
  Search,
  CheckCircle2,
  Heart,
  ArrowRight,
  Phone,
  Send,
  Camera,
  Image as ImageIcon,
  ShieldCheck,
  Paperclip,
  Upload,
  X,
  Pencil,
  Trash2,
  Check,
  Smile,
  ArrowLeft,
  ChevronLeft,
  MoreVertical,
  Info,
  ThumbsUp,
  Shield,
  Ban,
  ShieldAlert,
} from 'lucide-react';
import { ContactCard } from '@/components/communication/contact-card';
import { useAuth } from '@/lib/auth-context';
import { ShareContactModal } from '@/components/communication/share-contact-modal';
import { SharePhotoModal } from '@/components/communication/share-photo-modal';
import { SafetyBanner } from '@/components/communication/safety-banner';

function MessagesInboxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMatchId = searchParams ? searchParams.get('matchId') : null;

  const { currentUser } = useAuth();
  const communication = useCommunication();
  const connection = useConnection();

  const conversations = communication?.conversations || [];
  const messagesMap = communication?.messages || {};
  const sendMessage = communication?.sendMessage;
  const editMessage = communication?.editMessage;
  const deleteMessage = communication?.deleteMessage;
  const sharePhotoInChat = communication?.sharePhotoInChat;
  const markAsRead = communication?.markAsRead;
  const toggleBlockConversation = communication?.toggleBlockConversation;
  const deleteConversation = communication?.deleteConversation;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(
    urlMatchId || (conversations.length > 0 ? conversations[0].matchId : 'match-201')
  );

  // Mobile View Navigation State: 'LIST' shows Messenger chats list, 'CHAT' opens chat inbox
  const [mobileActiveView, setMobileActiveView] = useState<'LIST' | 'CHAT'>(
    urlMatchId ? 'CHAT' : 'LIST'
  );

  useEffect(() => {
    if (urlMatchId) {
      setSelectedMatchId(urlMatchId);
      setMobileActiveView('CHAT');
    } else if (conversations.length > 0) {
      if (!selectedMatchId || !conversations.some((c) => c.matchId === selectedMatchId)) {
        setSelectedMatchId(conversations[0].matchId);
      }
    }
  }, [urlMatchId, conversations, selectedMatchId]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedImageFileUrl, setSelectedImageFileUrl] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [isShareContactOpen, setIsShareContactOpen] = useState(false);
  const [isSharePhotoOpen, setIsSharePhotoOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const EMOJI_LIST = ['❤️', '💕', '💖', '💗', '🌹', '💐', '💍', '🌸', '✨', '😊', '🥰', '😍', '🙏', '👍', '☕', '🤗', '🕊️', '💌'];

  const filteredConversations = conversations.filter((c) =>
    c && c.profile && c.profile.fullName
      ? c.profile.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );

  const activeConv = conversations.find((c) => c.matchId === selectedMatchId) || conversations[0];
  const activeMessages = activeConv ? messagesMap[activeConv.matchId] || [] : [];

  const isUserScrolledUp = useRef(false);

  const handleChatScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    isUserScrolledUp.current = distanceFromBottom > 100;
  };

  const scrollToBottomInner = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when conversation or view changes
  useEffect(() => {
    isUserScrolledUp.current = false;
    setTimeout(scrollToBottomInner, 50);
  }, [selectedMatchId, mobileActiveView]);

  // Scroll to bottom when NEW message is added (only if user hasn't scrolled up to read history)
  const prevMsgCountRef = useRef(activeMessages.length);
  useEffect(() => {
    if (activeMessages.length > prevMsgCountRef.current) {
      if (!isUserScrolledUp.current) {
        setTimeout(scrollToBottomInner, 50);
      }
    }
    prevMsgCountRef.current = activeMessages.length;
  }, [activeMessages.length]);

  // Auto mark active conversation as read upon viewing (only if unread)
  useEffect(() => {
    if (activeConv && activeConv.unreadCount > 0 && markAsRead) {
      markAsRead(activeConv.matchId);
    }
  }, [activeConv?.matchId, activeConv?.unreadCount, markAsRead]);

  // Close emoji picker on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle local device image selection
  const handleFileSelectPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImageFileUrl(url);
    }
  };

  const handleSendTextMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputMessage;

    if (selectedImageFileUrl && activeConv && sharePhotoInChat) {
      sharePhotoInChat(activeConv.matchId, selectedImageFileUrl, textToSend || 'Shared a photo');
      setSelectedImageFileUrl(null);
      setInputMessage('');
      setTimeout(scrollToBottomInner, 50);
      return;
    }

    if (!textToSend.trim() || !activeConv || !sendMessage) return;

    sendMessage(activeConv.matchId, textToSend.trim(), 'TEXT');
    setInputMessage('');
    setShowEmojiPicker(false);
    setTimeout(scrollToBottomInner, 50);
  };

  const handleSaveEditedMessage = (messageId: string) => {
    if (!editingText.trim() || !activeConv || !editMessage) return;
    editMessage(activeConv.matchId, messageId, editingText.trim());
    setEditingMessageId(null);
    setEditingText('');
  };

  return (
    <MemberLayout title="Messenger Inbox">
      <div className="space-y-4 max-w-7xl mx-auto">
        
        {/* Messenger Container Box (Stable WhatsApp / Messenger Web Single-Page Layout) */}
        {conversations.length > 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-140px)] min-h-[520px] max-h-[850px]">
            
            {/* Left: Messenger Chats Sidebar */}
            <div className={`lg:col-span-4 border-r border-stone-200/80 flex-col justify-between bg-stone-50/60 h-full overflow-hidden ${
              mobileActiveView === 'LIST' ? 'flex' : 'hidden lg:flex'
            }`}>
              
              {/* Sidebar Header */}
              <div className="p-3.5 sm:p-4 border-b border-stone-200/80 bg-white space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-sans font-extrabold text-xl text-stone-900 tracking-tight flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white flex items-center justify-center text-xs shadow-md">
                      💬
                    </span>
                    <span>Chats</span>
                  </h2>
                  <span className="text-[10px] font-mono font-bold bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full border border-pink-200">
                    Messenger
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Messenger..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-stone-100 border border-stone-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:bg-white focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
                {filteredConversations.map((conv) => {
                  const isSelected = selectedMatchId === conv.matchId;
                  const isUnread = conv.unreadCount > 0;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedMatchId(conv.matchId);
                        setMobileActiveView('CHAT'); // Mobile view opens chat
                        if (markAsRead) {
                          markAsRead(conv.matchId);
                        }
                      }}
                      className={`group p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 relative ${
                        isSelected
                          ? 'bg-pink-50/80 border border-pink-200 shadow-xs'
                          : 'bg-transparent hover:bg-white/80 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        
                        {/* Messenger Avatar with Online Green Dot */}
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-pink-100 border border-stone-200 shrink-0">
                          <Image
                            src={conv?.profile?.photoUrl || '/images/default-avatar.jpg'}
                            alt={conv?.profile?.fullName || 'Candidate'}
                            fill
                            className="object-cover object-top"
                          />
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-xs ${
                            conv.status === 'BLOCKED' ? 'bg-rose-500' : 'bg-emerald-500'
                          }`} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className={`font-sans text-xs sm:text-sm truncate ${
                              isUnread ? 'font-extrabold text-stone-900' : 'font-bold text-stone-800'
                            }`}>
                              {conv?.profile?.fullName || 'Candidate'}
                            </h4>
                            {conv.status === 'BLOCKED' && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 font-bold shrink-0">
                                Blocked
                              </span>
                            )}
                          </div>
                          <p className={`text-xs truncate mt-0.5 ${
                            isUnread ? 'font-bold text-pink-700' : 'text-stone-500'
                          }`}>
                            {conv.lastSenderId && currentUser && (conv.lastSenderId === currentUser.id || conv.lastSenderId === currentUser.email) ? 'You: ' : ''}{conv.lastMessage}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-stone-400 font-mono">
                          {conv.lastMessageAt}
                        </span>
                        <div className="flex items-center gap-1">
                          {isUnread && (
                            <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse shadow-xs" />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (deleteConversation) {
                                deleteConversation(conv.matchId);
                                if (selectedMatchId === conv.matchId) {
                                  setSelectedMatchId(null);
                                }
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right: Messenger Chat Window */}
            <div className={`flex-col justify-between bg-white overflow-hidden ${
              mobileActiveView === 'CHAT'
                ? 'fixed inset-0 z-[100] flex h-[100dvh] w-screen lg:static lg:z-auto lg:h-full lg:w-auto lg:col-span-8 lg:flex'
                : 'hidden lg:flex lg:col-span-8 h-full'
            }`}>
              {activeConv ? (
                <>
                  {/* Messenger Top Header */}
                  <div className="p-3 sm:p-4 border-b border-stone-200/80 flex items-center justify-between bg-white shadow-2xs shrink-0 z-10">
                    <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
                      
                      {/* Mobile Back Button (Chats List) */}
                      <button
                        onClick={() => setMobileActiveView('LIST')}
                        className="lg:hidden p-1.5 rounded-full hover:bg-stone-100 active:bg-stone-200 text-stone-700 transition-all border border-stone-200 shadow-2xs shrink-0"
                        title="Back to Chats"
                      >
                        <ChevronLeft className="w-5 h-5 text-stone-800" />
                      </button>

                      <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-pink-50 border border-stone-200 shrink-0">
                        <Image
                          src={activeConv?.profile?.photoUrl || '/images/default-avatar.jpg'}
                          alt={activeConv?.profile?.fullName || 'Candidate'}
                          fill
                          className="object-cover object-top"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-sans font-bold text-stone-900 text-xs sm:text-base leading-tight truncate">
                          {activeConv?.profile?.fullName || 'Candidate'}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold flex items-center gap-1 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                          <span className="truncate">Active Now <span className="hidden sm:inline">• {activeConv?.profile?.profession || 'Verified Candidate'}</span></span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSharePhotoOpen(true)}
                        disabled={activeConv.status === 'BLOCKED'}
                        className="rounded-full text-[10px] sm:text-xs border-pink-200 text-pink-800 hover:bg-pink-50 px-2 sm:px-3 h-8 sm:h-9"
                        leftIcon={<Camera className="w-3.5 h-3.5 text-pink-600" />}
                      >
                        <span className="hidden sm:inline">Share Photo</span>
                        <span className="sm:hidden">Photo</span>
                      </Button>

                      <Button
                        variant="wine"
                        size="sm"
                        onClick={() => setIsShareContactOpen(true)}
                        disabled={activeConv.status === 'BLOCKED'}
                        className="rounded-full text-[10px] sm:text-xs shadow-sm px-2 sm:px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-8 sm:h-9"
                        leftIcon={<MessageCircle className="w-3.5 h-3.5 text-white" />}
                      >
                        <span className="hidden sm:inline">Request WhatsApp</span>
                        <span className="sm:hidden">WhatsApp</span>
                      </Button>

                      {/* Block / Unblock Action Button */}
                      {activeConv.status === 'BLOCKED' ? (
                        currentUser && activeConv.blockedBy && (activeConv.blockedBy === currentUser.id || activeConv.blockedBy === currentUser.email) ? (
                          <Button
                            variant="wine"
                            size="sm"
                            onClick={() => toggleBlockConversation && toggleBlockConversation(activeConv.matchId)}
                            className="rounded-full text-[10px] sm:text-xs px-2 sm:px-3 bg-rose-700 hover:bg-rose-800 text-white font-bold h-8 sm:h-9"
                            leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                          >
                            <span>Unblock</span>
                          </Button>
                        ) : (
                          <span className="text-[10px] sm:text-[11px] px-2 py-1 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                            <Ban className="w-3 h-3 text-rose-600" />
                            <span>Blocked</span>
                          </span>
                        )
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleBlockConversation && toggleBlockConversation(activeConv.matchId)}
                          className="inline-flex rounded-full text-[10px] sm:text-xs px-2 sm:px-3 border-stone-300 text-rose-700 hover:bg-rose-50 h-8 sm:h-9"
                          leftIcon={<Ban className="w-3.5 h-3.5 text-rose-600" />}
                        >
                          <span>Block</span>
                        </Button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (deleteConversation) {
                            deleteConversation(activeConv.matchId);
                            setSelectedMatchId(null);
                          }
                        }}
                        className="hidden sm:block p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Safety Advice Banner */}
                  <div className="px-4 pt-2 shrink-0">
                    <SafetyBanner />
                  </div>

                  {/* Chat Messages Body Area (Messenger Bubbles) */}
                  <div
                    ref={chatContainerRef}
                    onScroll={handleChatScroll}
                    className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-stone-50/40"
                  >
                    {activeMessages.length === 0 ? (
                      <div className="text-center py-12 text-stone-400 space-y-2">
                        <MessageSquare className="w-8 h-8 text-pink-400 mx-auto" />
                        <p className="text-xs font-semibold">
                          You are connected with {activeConv.profile.fullName}!
                        </p>
                        <p className="text-[11px] text-stone-400">
                          Send a message, emojis, or photos to start chatting.
                        </p>
                      </div>
                    ) : (
                      activeMessages.map((msg) => {
                        const isMine = Boolean(
                          currentUser &&
                          (msg.senderId === currentUser.id ||
                            (currentUser.email && msg.senderId === currentUser.email))
                        );
                        const isEditingThis = editingMessageId === msg.id;

                        const isPhotoMsg =
                          msg.type === 'IMAGE' ||
                          Boolean(msg.mediaUrl) ||
                          (typeof msg.content === 'string' &&
                            (msg.content.startsWith('http') ||
                              msg.content.startsWith('blob:') ||
                              msg.content.startsWith('data:')));

                        const photoSrc =
                          msg.mediaUrl ||
                          (typeof msg.content === 'string' &&
                          (msg.content.startsWith('http') ||
                            msg.content.startsWith('blob:') ||
                            msg.content.startsWith('data:'))
                            ? msg.content
                            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800');

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col group relative ${isMine ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5">
                              {/* Edit & Delete Action Buttons */}
                              {isMine && !isEditingThis && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-xs">
                                  <button
                                    onClick={() => {
                                      setEditingMessageId(msg.id);
                                      setEditingText(msg.content);
                                    }}
                                    className="p-1 text-stone-600 hover:text-pink-600 hover:bg-stone-100 rounded-lg"
                                    title="Edit Message"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (deleteMessage && activeConv) {
                                        deleteMessage(activeConv.matchId, msg.id);
                                      }
                                    }}
                                    className="p-1 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Delete Message"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                              {/* Message Bubble Render */}
                              {isEditingThis ? (
                                <div className="flex items-center gap-2 bg-stone-100 p-2 rounded-2xl border border-stone-300">
                                  <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="text-xs bg-white border border-stone-300 rounded-xl px-2 py-1 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSaveEditedMessage(msg.id)}
                                    className="p-1.5 bg-pink-600 text-white rounded-lg text-xs"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingMessageId(null)}
                                    className="p-1.5 bg-stone-300 text-stone-700 rounded-lg text-xs"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : isPhotoMsg ? (
                                <div className="max-w-xs space-y-1.5">
                                  <div className="relative w-60 h-60 rounded-3xl overflow-hidden border border-pink-200 shadow-md">
                                    <Image src={photoSrc} alt="Shared Photo" fill className="object-cover" />
                                  </div>
                                  {msg.content && !msg.content.startsWith('http') && !msg.content.startsWith('blob:') && (
                                    <p className="text-xs text-stone-700 bg-pink-50 p-2.5 rounded-2xl border border-pink-100">
                                      {msg.content}
                                    </p>
                                  )}
                                </div>
                              ) : msg.type === 'CONTACT' || msg.contactDetails ? (
                                <div className="max-w-md">
                                  <ContactCard
                                    matchId={activeConv.matchId}
                                    messageId={msg.id}
                                    contactDetails={msg.contactDetails}
                                    isSender={isMine}
                                  />
                                </div>
                              ) : (
                                <div
                                  className={`px-4 py-2.5 rounded-3xl max-w-sm text-xs leading-relaxed ${
                                    isMine
                                      ? 'bg-gradient-to-r from-pink-600 via-pink-700 to-rose-600 text-white shadow-md shadow-pink-900/10 rounded-br-xs'
                                      : 'bg-stone-100 text-stone-900 rounded-bl-xs border border-stone-200/90 shadow-2xs'
                                  }`}
                                >
                                  {msg.content}
                                </div>
                              )}
                            </div>

                            <span className="text-[9px] text-stone-400 font-mono mt-1 px-1 flex items-center gap-1">
                              <span className="font-semibold">{isMine ? 'You' : activeConv?.profile?.fullName?.split(' ')[0] || 'Member'}</span>
                              <span>•</span>
                              <span>{msg.createdAt || msg.sentAt}</span>
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Attachment Preview Drawer */}
                  {selectedImageFileUrl && (
                    <div className="px-4 py-2 bg-pink-50 border-t border-pink-100 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-pink-300">
                          <Image src={selectedImageFileUrl} alt="Attached Preview" fill className="object-cover" />
                        </div>
                        <span className="text-xs text-pink-900 font-bold">Image attached</span>
                      </div>
                      <button
                        onClick={() => setSelectedImageFileUrl(null)}
                        className="p-1 rounded-full bg-pink-200 text-pink-800 hover:bg-pink-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Messenger Bottom Input Bar or Blocked Banner */}
                  {activeConv.status === 'BLOCKED' ? (
                    <div className="p-4 bg-rose-50 border-t border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shrink-0">
                      <div className="flex items-center gap-2 text-rose-800 text-xs font-semibold">
                        <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          {currentUser && activeConv.blockedBy && (activeConv.blockedBy === currentUser.id || activeConv.blockedBy === currentUser.email)
                            ? `You have blocked ${activeConv.profile.fullName}. Unblock to resume messaging.`
                            : `You cannot send messages or reply to this conversation because you have been blocked by ${activeConv.profile.fullName}.`}
                        </span>
                      </div>
                      {currentUser && activeConv.blockedBy && (activeConv.blockedBy === currentUser.id || activeConv.blockedBy === currentUser.email) && (
                        <Button
                          variant="wine"
                          size="sm"
                          onClick={() => toggleBlockConversation && toggleBlockConversation(activeConv.matchId)}
                          className="rounded-full text-xs shrink-0 bg-rose-700 hover:bg-rose-800 text-white font-bold"
                        >
                          Unblock Member
                        </Button>
                      )}
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => handleSendTextMessage(e)}
                      className="p-3 sm:p-3.5 pb-safe border-t border-stone-200/80 bg-white flex items-center gap-2 relative shrink-0"
                    >
                      {/* Emoji Picker Popover */}
                      {showEmojiPicker && (
                        <div
                          ref={emojiPickerRef}
                          className="absolute bottom-16 left-4 bg-white p-3 rounded-2xl border border-pink-200 shadow-2xl grid grid-cols-6 gap-2 z-50 animate-in fade-in slide-in-from-bottom-2"
                        >
                          {EMOJI_LIST.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setInputMessage((prev) => prev + emoji);
                              }}
                              className="text-lg p-1.5 hover:bg-pink-50 rounded-xl transition-all"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      <input
                        type="file"
                        ref={directFileInputRef}
                        onChange={handleFileSelectPreview}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => directFileInputRef.current?.click()}
                        className="p-2 rounded-full text-stone-500 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        title="Attach Photo"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 rounded-full text-stone-500 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        title="Insert Emoji"
                      >
                        <Smile className="w-5 h-5" />
                      </button>

                      <input
                        type="text"
                        placeholder={`Aa`}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="flex-1 bg-stone-100 border border-transparent rounded-full px-4 py-2 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-pink-500 transition-all"
                      />

                      {inputMessage.trim() ? (
                        <Button
                          type="submit"
                          variant="wine"
                          size="sm"
                          className="rounded-full w-8 h-8 p-0 flex items-center justify-center shrink-0 shadow-md shadow-pink-900/20"
                        >
                          <Send className="w-4 h-4 text-white" />
                        </Button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendTextMessage(undefined, '❤️')}
                          className="p-1.5 text-pink-600 hover:scale-110 transition-transform"
                          title="Send Heart Reaction"
                        >
                          <Heart className="w-5 h-5 fill-pink-600 text-pink-600" />
                        </button>
                      )}
                    </form>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center text-stone-400">
                  <p className="text-xs">Select a chat from the left to start messaging.</p>
                </div>
              )}
            </div>

          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No Active Conversations Yet"
            description="Private chat messaging unlocks automatically when you and another member accept an Express Interest request."
            actionLabel="Explore AI Matches"
            onAction={() => router.push('/search')}
          />
        )}

        {/* Contact Sharing Modal */}
        {activeConv && (
          <ShareContactModal
            isOpen={isShareContactOpen}
            onClose={() => setIsShareContactOpen(false)}
            receiverName={activeConv.profile.fullName}
            receiverId={activeConv.profile.id}
            matchId={activeConv.matchId}
          />
        )}

        {/* Photo Sharing Modal */}
        {activeConv && (
          <SharePhotoModal
            isOpen={isSharePhotoOpen}
            onClose={() => setIsSharePhotoOpen(false)}
            receiverName={activeConv.profile.fullName}
            receiverId={activeConv.profile.id}
            matchId={activeConv.matchId}
          />
        )}
      </div>
    </MemberLayout>
  );
}

export default function MessagesInboxPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-500">Loading messenger...</div>}>
      <MessagesInboxContent />
    </Suspense>
  );
}

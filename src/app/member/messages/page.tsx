'use client';

import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { ContactCard } from '@/components/communication/contact-card';
import { ShareContactModal } from '@/components/communication/share-contact-modal';
import { SharePhotoModal } from '@/components/communication/share-photo-modal';
import { SafetyBanner } from '@/components/communication/safety-banner';

export default function MessagesInboxPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMatchId = searchParams ? searchParams.get('matchId') : null;

  const communication = useCommunication();
  const connection = useConnection();

  const conversations = communication?.conversations || [];
  const messagesMap = communication?.messages || {};
  const sendMessage = communication?.sendMessage;
  const editMessage = communication?.editMessage;
  const deleteMessage = communication?.deleteMessage;
  const sharePhotoInChat = communication?.sharePhotoInChat;
  const markAsRead = communication?.markAsRead;

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
    }
  }, [urlMatchId]);

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

  // Smooth inner-container scrolling without shaking/wobbling the page layout
  const scrollToBottomInner = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottomInner();
  }, [activeMessages, selectedMatchId, mobileActiveView]);

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
        
        {/* Messenger Container Box */}
        {conversations.length > 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[75vh] sm:h-[80vh] min-h-[520px]">
            
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
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 relative ${
                        isSelected
                          ? 'bg-pink-50/80 border border-pink-200 shadow-xs'
                          : 'bg-transparent hover:bg-white/80 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        
                        {/* Messenger Avatar with Online Green Dot */}
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-pink-100 border border-stone-200 shrink-0">
                          <Image
                            src={conv?.profile?.photoUrl || '/images/default-avatar.jpg'}
                            alt={conv?.profile?.fullName || 'Candidate'}
                            fill
                            className="object-cover object-top"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className={`font-sans text-xs sm:text-sm truncate ${
                            isUnread ? 'font-extrabold text-stone-900' : 'font-bold text-stone-800'
                          }`}>
                            {conv?.profile?.fullName || 'Candidate'}
                          </h4>
                          <p className={`text-xs truncate mt-0.5 ${
                            isUnread ? 'font-bold text-pink-700' : 'text-stone-500'
                          }`}>
                            {conv.lastMessage}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-stone-400 font-mono">
                          {conv.lastMessageAt}
                        </span>
                        {isUnread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-600 animate-pulse shadow-xs" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right: Messenger Chat Window */}
            <div className={`lg:col-span-8 flex-col justify-between bg-white h-full overflow-hidden ${
              mobileActiveView === 'CHAT' ? 'flex' : 'hidden lg:flex'
            }`}>
              {activeConv ? (
                <>
                  {/* Messenger Top Header */}
                  <div className="p-3.5 sm:p-4 border-b border-stone-200/80 flex items-center justify-between bg-white shadow-2xs shrink-0 z-10">
                    <div className="flex items-center gap-2 sm:gap-3">
                      
                      {/* Mobile Back Button (Chats List) */}
                      <button
                        onClick={() => setMobileActiveView('LIST')}
                        className="lg:hidden p-1.5 rounded-xl bg-stone-100 hover:bg-pink-100 text-stone-700 hover:text-pink-800 transition-all border border-stone-200"
                        title="Back to Chats"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-pink-50 border border-stone-200 shrink-0">
                        <Image
                          src={activeConv?.profile?.photoUrl || '/images/default-avatar.jpg'}
                          alt={activeConv?.profile?.fullName || 'Candidate'}
                          fill
                          className="object-cover object-top"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-stone-900 text-sm sm:text-base leading-tight">
                          {activeConv?.profile?.fullName || 'Candidate'}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          <span>Active Now • {activeConv?.profile?.profession || 'Verified Candidate'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSharePhotoOpen(true)}
                        className="rounded-full text-[11px] sm:text-xs border-pink-200 text-pink-800 hover:bg-pink-50 px-2.5 sm:px-3"
                        leftIcon={<Camera className="w-3.5 h-3.5 text-pink-600" />}
                      >
                        <span className="hidden sm:inline">Share Photo</span>
                        <span className="sm:hidden">Photo</span>
                      </Button>

                      <Button
                        variant="wine"
                        size="sm"
                        onClick={() => setIsShareContactOpen(true)}
                        className="rounded-full text-[11px] sm:text-xs shadow-sm px-2.5 sm:px-3"
                        leftIcon={<Phone className="w-3.5 h-3.5 text-white" />}
                      >
                        <span className="hidden sm:inline">Share Contact</span>
                        <span className="sm:hidden">Contact</span>
                      </Button>
                    </div>
                  </div>

                  {/* Safety Advice Banner */}
                  <div className="px-4 pt-2 shrink-0">
                    <SafetyBanner />
                  </div>

                  {/* Chat Messages Body Area (Messenger Bubbles) */}
                  <div
                    ref={chatContainerRef}
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
                        const isMine = msg.senderId === 'p-101';
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
                                <div className="max-w-sm">
                                  <ContactCard contact={msg.contactDetails || { phone: msg.content }} />
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

                            <span className="text-[9px] text-stone-400 font-mono mt-1 px-1">
                              {msg.createdAt || msg.sentAt}
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

                  {/* Messenger Bottom Input Bar */}
                  <form
                    onSubmit={(e) => handleSendTextMessage(e)}
                    className="p-3 sm:p-3.5 border-t border-stone-200/80 bg-white flex items-center gap-2 relative shrink-0"
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
            matchId={activeConv.matchId}
          />
        )}

        {/* Photo Sharing Modal */}
        {activeConv && (
          <SharePhotoModal
            isOpen={isSharePhotoOpen}
            onClose={() => setIsSharePhotoOpen(false)}
            receiverName={activeConv.profile.fullName}
            matchId={activeConv.matchId}
          />
        )}
      </div>
    </MemberLayout>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { ChatAccessGuard } from '@/components/communication/chat-access-guard';
import { ContactCard } from '@/components/communication/contact-card';
import { ShareContactModal } from '@/components/communication/share-contact-modal';
import { SharePhotoModal } from '@/components/communication/share-photo-modal';
import { SafetyBanner } from '@/components/communication/safety-banner';
import { useConnection } from '@/lib/connection-context';
import { useCommunication } from '@/lib/communication-context';
import { MOCK_MATCHES } from '@/data/connection-data';
import { MOCK_PROFILES } from '@/data/mock-data';
import { Match } from '@/types';
import {
  Send,
  Image as ImageIcon,
  Phone,
  ArrowLeft,
  Camera,
  MessageSquare,
  X,
  Pencil,
  Trash2,
  Check,
  Smile,
} from 'lucide-react';

interface ChatRoomPageProps {
  params: {
    matchId: string;
  };
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const router = useRouter();
  const connection = useConnection();
  const communication = useCommunication();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const EMOJI_LIST = ['❤️', '💕', '💖', '💗', '🌹', '💐', '💍', '🌸', '✨', '😊', '🥰', '😍', '🙏', '👍', '☕', '🤗', '🕊️', '💌'];

  const rawMatches = connection?.matches;
  const safeMatches: Match[] =
    Array.isArray(rawMatches) && rawMatches.length > 0
      ? rawMatches
      : Array.isArray(MOCK_MATCHES)
      ? MOCK_MATCHES
      : [];

  const messages = communication?.messages || {};
  const sendMessage = communication?.sendMessage;
  const editMessage = communication?.editMessage;
  const deleteMessage = communication?.deleteMessage;
  const sharePhotoInChat = communication?.sharePhotoInChat;
  const markAsRead = communication?.markAsRead;

  const [inputMessage, setInputMessage] = useState('');
  const [selectedImageFileUrl, setSelectedImageFileUrl] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [isShareContactOpen, setIsShareContactOpen] = useState(false);
  const [isSharePhotoOpen, setIsSharePhotoOpen] = useState(false);

  // Match lookup
  const match = safeMatches.find(
    (m) => m && (m.id === params.matchId || m.userTwoId === params.matchId)
  );
  const matchedProfile = match
    ? match.profile
    : MOCK_PROFILES.find((p) => p.id === params.matchId) || MOCK_PROFILES[0];

  const chatMessages = messages[match?.id || params.matchId] || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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

  useEffect(() => {
    if (match && markAsRead) {
      markAsRead(match.id || params.matchId);
    }
  }, [match, params.matchId, markAsRead]);

  if (!matchedProfile) {
    notFound();
  }

  // Handle local device image selection
  const handleFileSelectPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImageFileUrl(url);
    }
  };

  // Submit Text & Attached Photo together on Send button click
  const handleSendCombined = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedImageFileUrl) return;

    if (selectedImageFileUrl && sharePhotoInChat) {
      sharePhotoInChat(match?.id || params.matchId, selectedImageFileUrl, matchedProfile.id);
    }

    if (inputMessage.trim() && sendMessage) {
      sendMessage(match?.id || params.matchId, inputMessage, matchedProfile.id);
    }

    setInputMessage('');
    setSelectedImageFileUrl(null);
    setShowEmojiPicker(false);
  };

  // Edit Message Submit
  const handleSaveEdit = (messageId: string) => {
    if (editingText.trim() && editMessage) {
      editMessage(match?.id || params.matchId, messageId, editingText);
      setEditingMessageId(null);
      setEditingText('');
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setInputMessage((prev) => prev + emoji);
  };

  return (
    <div className="min-h-[85vh] bg-stone-50/50 py-6">
      <Container size="lg">
        <ChatAccessGuard
          profile={matchedProfile}
          matchId={params.matchId}
          matchedProfileName={matchedProfile.fullName}
          isMutualMatch={Boolean(match)}
          matchStatus={match?.status || 'ACTIVE'}
        >
          <div className="bg-white rounded-3xl border border-rose-100 shadow-xl overflow-hidden flex flex-col h-[78vh]">
            
            {/* Top Chat Header with Guaranteed window.location Back Navigation */}
            <div className="bg-white p-4 border-b border-rose-100 flex items-center justify-between shadow-xs z-10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/member/messages';
                  }}
                  className="p-2 text-stone-700 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-stone-200"
                  title="Back to Messages Inbox"
                >
                  <ArrowLeft className="w-5 h-5 text-stone-700" />
                  <span className="text-xs font-bold text-stone-800">Back to Inbox</span>
                </button>

                <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-rose-50 border-2 border-rose-100 shrink-0">
                  <Image
                    src={matchedProfile.photoUrl}
                    alt={matchedProfile.fullName}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-serif font-bold text-stone-900 text-base">
                      {matchedProfile.fullName}
                    </h2>
                    {matchedProfile.isVerified && <VerifiedBadge size="sm" />}
                  </div>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    <span>Active Match • {matchedProfile.profession}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSharePhotoOpen(true)}
                  className="hidden sm:inline-flex rounded-full text-xs border-rose-200 text-rose-800 hover:bg-rose-50"
                  leftIcon={<Camera className="w-3.5 h-3.5 text-rose-600" />}
                >
                  Share Photo
                </Button>

                <Button
                  variant="wine"
                  size="sm"
                  onClick={() => setIsShareContactOpen(true)}
                  className="rounded-full text-xs shadow-sm"
                  leftIcon={<Phone className="w-3.5 h-3.5 text-white" />}
                >
                  Contact Info
                </Button>
              </div>
            </div>

            {/* Safety Advice Banner */}
            <div className="px-4 pt-3">
              <SafetyBanner />
            </div>

            {/* Chat Messages Body Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12 text-stone-400 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold">
                    You are mutually connected with {matchedProfile.fullName}!
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Send a text message, emojis, attach a photo, or share your contact number below.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => {
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
                        {/* Edit & Delete Action Control Buttons */}
                        {isMine && !isEditingThis && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 shadow-xs">
                            <button
                              onClick={() => {
                                setEditingMessageId(msg.id);
                                setEditingText(msg.content);
                              }}
                              className="p-1 text-stone-600 hover:text-rose-600 hover:bg-stone-200 rounded-lg"
                              title="Edit Message"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (deleteMessage) {
                                  deleteMessage(match?.id || params.matchId, msg.id);
                                }
                              }}
                              className="p-1 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div
                          className={`max-w-[75%] p-3.5 rounded-2xl text-xs space-y-1.5 ${
                            isMine
                              ? 'bg-gradient-to-r from-rose-600 to-pink-700 text-white rounded-br-none shadow-md'
                              : 'bg-stone-100 text-stone-900 rounded-bl-none border border-stone-200/80 shadow-xs'
                          }`}
                        >
                          {isEditingThis ? (
                            <div className="flex items-center gap-1.5 text-stone-900 bg-white p-1.5 rounded-xl border border-stone-200">
                              <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="bg-transparent text-xs text-stone-900 focus:outline-none flex-1 px-1"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEdit(msg.id)}
                                className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                title="Save Edits"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="p-1 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : isPhotoMsg ? (
                            <div className="space-y-1.5 p-1">
                              <div className="overflow-hidden rounded-xl border border-white/20 shadow-sm max-w-xs bg-stone-900">
                                <img
                                  src={photoSrc}
                                  alt="Shared Photo"
                                  className="w-full h-auto max-h-64 object-cover rounded-xl"
                                />
                              </div>
                              <p className="text-[11px] font-medium opacity-90">📷 Shared Photo</p>
                            </div>
                          ) : msg.type === 'CONTACT' ? (
                            <ContactCard contactDetails={msg.contactDetails!} isSender={isMine} />
                          ) : (
                            <p className="leading-relaxed whitespace-pre-wrap text-sm">{msg.content}</p>
                          )}

                          <span
                            className={`text-[9px] block text-right font-mono ${
                              isMine ? 'text-rose-200' : 'text-stone-400'
                            }`}
                          >
                            {msg.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Attachment Preview Drawer */}
            {selectedImageFileUrl && (
              <div className="px-4 py-2 bg-rose-50/80 border-t border-rose-200 flex items-center justify-between animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-rose-300 shadow-xs bg-stone-900">
                    <img
                      src={selectedImageFileUrl}
                      alt="Attached Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      📷 Photo Attached
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Press Send button below to deliver photo.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedImageFileUrl(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200"
                  title="Remove photo attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Messenger Bottom Composer Form with Emoji Picker */}
            <form
              onSubmit={handleSendCombined}
              className="p-3 bg-stone-50 border-t border-rose-100 flex items-center gap-2 relative"
            >
              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-16 left-3 bg-white p-3 rounded-2xl border border-rose-200 shadow-xl grid grid-cols-6 gap-2 z-50 animate-in zoom-in-95"
                >
                  {EMOJI_LIST.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleInsertEmoji(emoji)}
                      className="text-lg hover:scale-125 transition-transform p-1 rounded-lg hover:bg-rose-50"
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

              {/* Emoji Trigger Icon Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2.5 rounded-full text-stone-600 hover:text-rose-600 hover:bg-rose-100/60 transition-colors"
                title="Insert Emoji"
              >
                <Smile className="w-5 h-5 text-amber-500" />
              </button>

              {/* Photo Attachment Icon Button */}
              <button
                type="button"
                onClick={() => directFileInputRef.current?.click()}
                className={`p-2.5 rounded-full transition-colors ${
                  selectedImageFileUrl
                    ? 'bg-rose-200 text-rose-800'
                    : 'text-stone-600 hover:text-rose-600 hover:bg-rose-100/60'
                }`}
                title="Attach Photo from Local Device"
              >
                <ImageIcon className="w-5 h-5 text-rose-600" />
              </button>

              {/* Contact Attachment Icon Button */}
              <button
                type="button"
                onClick={() => setIsShareContactOpen(true)}
                className="p-2.5 rounded-full text-stone-600 hover:text-emerald-600 hover:bg-emerald-100/60 transition-colors"
                title="Share Verified Contact Details"
              >
                <Phone className="w-5 h-5 text-emerald-600" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder={
                  selectedImageFileUrl
                    ? 'Add a caption for your photo...'
                    : `Type a message to ${matchedProfile.fullName.split(' ')[0]}...`
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-white border border-stone-200 rounded-2xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-rose-500 shadow-xs"
              />

              {/* Send Button */}
              <Button
                type="submit"
                variant="wine"
                size="sm"
                className="rounded-2xl px-4 shadow-sm"
                disabled={!inputMessage.trim() && !selectedImageFileUrl}
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </form>

          </div>
        </ChatAccessGuard>

        {/* Modals */}
        <ShareContactModal
          isOpen={isShareContactOpen}
          onClose={() => setIsShareContactOpen(false)}
          matchId={match?.id || params.matchId}
          receiverId={matchedProfile.id}
          receiverName={matchedProfile.fullName}
          recipientName={matchedProfile.fullName}
        />

        <SharePhotoModal
          isOpen={isSharePhotoOpen}
          onClose={() => setIsSharePhotoOpen(false)}
          matchId={match?.id || params.matchId}
          receiverId={matchedProfile.id}
          receiverName={matchedProfile.fullName}
          recipientName={matchedProfile.fullName}
        />
      </Container>
    </div>
  );
}

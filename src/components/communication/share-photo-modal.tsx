'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import { useCommunication } from '@/lib/communication-context';

export interface SharePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  receiverId?: string;
  recipientName?: string;
  receiverName?: string;
}

export function SharePhotoModal({
  isOpen,
  onClose,
  matchId,
  receiverId = 'p-103',
  recipientName,
  receiverName,
}: SharePhotoModalProps) {
  const communication = useCommunication();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const targetName = (receiverName || recipientName || 'Member').split(' ')[0];

  const samplePhotos = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
  ];

  // Handle local device file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
      setSelectedFileName(file.name);
    }
  };

  const handleSendPhoto = (urlToSend: string) => {
    if (communication?.sharePhotoInChat) {
      communication.sharePhotoInChat(matchId, urlToSend, receiverId);
    }
    setSelectedFileUrl(null);
    setSelectedFileName(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-4 py-2 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ImageIcon className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Share Photo with {targetName}
          </h3>
          <p className="text-xs text-stone-600">
            Upload an image from your local device or choose a sample photo below.
          </p>
        </div>

        {/* Local Device File Upload Area */}
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {selectedFileUrl ? (
            <div className="p-3 bg-rose-50 rounded-2xl border-2 border-rose-200 space-y-2 text-center">
              <div className="relative w-36 h-36 mx-auto rounded-xl overflow-hidden shadow-md border border-white">
                <Image src={selectedFileUrl} alt="Selected Local Preview" fill className="object-cover" />
              </div>
              <p className="text-xs font-semibold text-rose-900 truncate px-2">{selectedFileName}</p>
              <div className="flex justify-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFileUrl(null);
                    setSelectedFileName(null);
                  }}
                  className="text-stone-600 border-stone-300 text-xs"
                >
                  Change
                </Button>
                <Button
                  variant="wine"
                  size="sm"
                  onClick={() => handleSendPhoto(selectedFileUrl)}
                  className="shadow-md text-xs font-bold"
                >
                  Send Selected Photo 📷
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-400 transition-all text-center space-y-1 group"
            >
              <Upload className="w-6 h-6 text-rose-500 mx-auto group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-stone-800 block">
                Select Image from Device / Mobile 📱
              </span>
              <span className="text-[10px] text-stone-400 block">
                Supports JPG, PNG, WEBP (Max 10MB)
              </span>
            </button>
          )}
        </div>

        {/* Sample Photos Section */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 block text-left tracking-wider mb-2">
            Or choose sample photos:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {samplePhotos.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendPhoto(url)}
                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-stone-200 hover:border-rose-500 hover:scale-105 transition-all group"
              >
                <Image src={url} alt={`Gallery ${i}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-rose-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                  Send
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

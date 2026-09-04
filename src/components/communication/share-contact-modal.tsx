'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Mail, ShieldCheck } from 'lucide-react';
import { useCommunication } from '@/lib/communication-context';

export interface ShareContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
  receiverId?: string;
  receiverName?: string;
  recipientName?: string;
}

export function ShareContactModal({
  isOpen,
  onClose,
  matchId,
  receiverId = 'p-103',
  receiverName,
  recipientName,
}: ShareContactModalProps) {
  const communication = useCommunication();
  const [includePhone, setIncludePhone] = useState(true);
  const [includeWhatsapp, setIncludeWhatsapp] = useState(true);
  const [includeEmail, setIncludeEmail] = useState(false);

  const targetName = (receiverName || recipientName || 'Member').split(' ')[0];

  const handleShare = () => {
    if (communication?.shareContactInChat) {
      communication.shareContactInChat(matchId, receiverId, {
        phone: includePhone ? '+880 1712-345678' : undefined,
        whatsapp: includeWhatsapp ? '+880 1712-345678' : undefined,
        email: includeEmail ? 'anika.rahman@example.com' : undefined,
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-4 py-2 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Share Verified Contact Details?
          </h3>
          <p className="text-xs text-stone-600">
            Select which contact methods to share privately with {targetName}.
          </p>
        </div>

        <div className="space-y-2 text-left bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
          <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-white">
            <span className="flex items-center gap-2 font-medium">
              <Phone className="w-4 h-4 text-emerald-600" /> Phone Number (+880 1712-345678)
            </span>
            <input
              type="checkbox"
              checked={includePhone}
              onChange={(e) => setIncludePhone(e.target.checked)}
              className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-white">
            <span className="flex items-center gap-2 font-medium">
              <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp (+880 1712-345678)
            </span>
            <input
              type="checkbox"
              checked={includeWhatsapp}
              onChange={(e) => setIncludeWhatsapp(e.target.checked)}
              className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-white">
            <span className="flex items-center gap-2 font-medium">
              <Mail className="w-4 h-4 text-emerald-600" /> Email (anika.rahman@example.com)
            </span>
            <input
              type="checkbox"
              checked={includeEmail}
              onChange={(e) => setIncludeEmail(e.target.checked)}
              className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
            />
          </label>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="wine"
            size="sm"
            onClick={handleShare}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md"
          >
            Share Contact Details
          </Button>
        </div>
      </div>
    </Modal>
  );
}

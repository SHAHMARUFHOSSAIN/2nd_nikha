'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { MessageCircle, ShieldCheck, Lock, Check } from 'lucide-react';
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
  const fullName = receiverName || recipientName || 'Member';
  const targetName = fullName.split(' ')[0];

  const handleSendRequest = () => {
    if (communication?.requestWhatsAppExchange) {
      communication.requestWhatsAppExchange(matchId, receiverId, fullName);
    } else if (communication?.shareContactInChat) {
      communication.shareContactInChat(matchId, receiverId, { recipientName: fullName } as any);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-4 py-2 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
          <MessageCircle className="w-7 h-7 fill-emerald-600 text-emerald-600" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Request WhatsApp Contact Exchange?
          </h3>
          <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
            Send a formal WhatsApp exchange request to <strong>{fullName}</strong>.
          </p>
        </div>

        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-stone-700 text-left space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Mutual Privacy Safeguard</span>
          </div>
          <ul className="space-y-1 text-[11px] text-stone-600 list-disc pl-4">
            <li>Your WhatsApp number remains hidden until {targetName} accepts your request.</li>
            <li>Once accepted, both of your verified WhatsApp numbers will be shared mutually on both sides.</li>
            <li>Direct WhatsApp chat links will be unlocked automatically.</li>
          </ul>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            variant="wine"
            size="sm"
            onClick={handleSendRequest}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md"
            leftIcon={<MessageCircle className="w-4 h-4 text-white" />}
          >
            Send WhatsApp Request
          </Button>
        </div>
      </div>
    </Modal>
  );
}

'use client';

import React from 'react';
import { MessageCircle, ShieldCheck, Check, X, Lock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCommunication } from '@/lib/communication-context';

export interface ContactCardProps {
  matchId?: string;
  messageId?: string;
  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    status?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    requesterId?: string;
    requesterName?: string;
    requesterWhatsapp?: string;
    recipientId?: string;
    recipientName?: string;
    recipientWhatsapp?: string;
  };
  contactDetails?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    status?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    requesterId?: string;
    requesterName?: string;
    requesterWhatsapp?: string;
    recipientId?: string;
    recipientName?: string;
    recipientWhatsapp?: string;
  };
  isSender?: boolean;
  isOwn?: boolean;
}

export function ContactCard({
  matchId,
  messageId,
  contact,
  contactDetails,
  isSender,
  isOwn = false,
}: ContactCardProps) {
  const communication = useCommunication();
  const activeDetails = contact || contactDetails;
  const isMine = isSender !== undefined ? isSender : isOwn;

  const status = activeDetails?.status || (activeDetails?.whatsapp ? 'ACCEPTED' : 'PENDING');
  const requesterName = activeDetails?.requesterName || 'Member';
  const recipientName = activeDetails?.recipientName || 'Member';
  const requesterWhatsapp = activeDetails?.requesterWhatsapp || '+880 1712-345678';
  const recipientWhatsapp = activeDetails?.recipientWhatsapp || '+880 1819-876543';

  // Determine partner WhatsApp and my WhatsApp for accepted state
  const partnerWhatsapp = isMine ? recipientWhatsapp : requesterWhatsapp;
  const myWhatsapp = isMine ? requesterWhatsapp : recipientWhatsapp;
  const partnerName = isMine ? recipientName : requesterName;

  const handleAccept = () => {
    if (matchId && messageId && communication?.respondToWhatsAppRequest) {
      communication.respondToWhatsAppRequest(matchId, messageId, 'ACCEPT');
    }
  };

  const handleDecline = () => {
    if (matchId && messageId && communication?.respondToWhatsAppRequest) {
      communication.respondToWhatsAppRequest(matchId, messageId, 'DECLINE');
    }
  };

  const handleOpenWhatsApp = () => {
    const digits = partnerWhatsapp.replace(/\D/g, '');
    const cleanNumber = digits.startsWith('88') ? digits : `88${digits}`;
    const url = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(
      'Assalamu Alaikum! Connected via 2nd Nikha Matrimonial.'
    )}`;
    window.open(url, '_blank');
  };

  if (status === 'PENDING') {
    return (
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white p-4 sm:p-5 rounded-3xl shadow-xl space-y-3 max-w-md border border-emerald-900/80 my-2">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white">
                WhatsApp Number Exchange Request
              </h4>
              <span className="text-[10px] text-amber-400 font-mono font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Pending Approval (Numbers Locked)</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">
          {isMine
            ? `You requested to exchange WhatsApp numbers with ${recipientName.split(' ')[0]}. Numbers will be revealed mutually upon acceptance.`
            : `${requesterName} wants to exchange verified WhatsApp numbers with you on 2nd Nikha.`}
        </p>

        {!isMine ? (
          <div className="pt-1 flex items-center gap-2">
            <Button
              variant="wine"
              size="sm"
              onClick={handleAccept}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md justify-center"
              leftIcon={<Check className="w-4 h-4 text-white" />}
            >
              Accept WhatsApp Exchange
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="rounded-xl border-stone-700 text-stone-300 hover:bg-stone-800 text-xs justify-center"
              leftIcon={<X className="w-4 h-4 text-stone-400" />}
            >
              Decline
            </Button>
          </div>
        ) : (
          <div className="p-2.5 bg-stone-900/80 rounded-2xl border border-stone-800 text-[11px] text-stone-400 flex items-center justify-between font-mono">
            <span>Status: Waiting for {recipientName.split(' ')[0]}...</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  if (status === 'DECLINED') {
    return (
      <div className="bg-stone-900 text-stone-300 p-4 rounded-2xl border border-stone-800 max-w-md my-2 text-xs space-y-1">
        <div className="flex items-center gap-2 text-red-400 font-bold">
          <X className="w-4 h-4" />
          <span>WhatsApp Exchange Request Declined</span>
        </div>
        <p className="text-[11px] text-stone-400">
          The request to exchange WhatsApp contact details was not accepted.
        </p>
      </div>
    );
  }

  // ACCEPTED Status: Mutually reveal WhatsApp numbers for both sides
  return (
    <div className="bg-gradient-to-br from-emerald-950 via-stone-950 to-emerald-900 text-white p-5 rounded-3xl shadow-xl space-y-3.5 max-w-md border border-emerald-600/60 my-2 animate-in zoom-in-95">
      <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500 text-white shadow-md">
            <MessageCircle className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-emerald-200">
              ✓ WhatsApp Exchange Accepted!
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              Mutual Contact Access Unlocked
            </span>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
      </div>

      <div className="space-y-2 text-xs bg-stone-900/90 p-3.5 rounded-2xl border border-emerald-900/60 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-stone-300 flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>{partnerName}'s WhatsApp:</span>
          </span>
          <strong className="font-mono text-emerald-300 text-sm tracking-wide">
            {partnerWhatsapp}
          </strong>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-800">
          <span className="text-stone-400 text-[11px]">Your Shared WhatsApp:</span>
          <span className="font-mono text-stone-300 text-xs">{myWhatsapp}</span>
        </div>
      </div>

      <Button
        variant="wine"
        size="sm"
        onClick={handleOpenWhatsApp}
        className="w-full justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/40 py-2.5"
        rightIcon={<ExternalLink className="w-4 h-4 text-white" />}
      >
        Open Direct Chat on WhatsApp ({partnerWhatsapp})
      </Button>
    </div>
  );
}

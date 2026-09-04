import React from 'react';
import { Lock, Phone, MessageCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ContactSharingBoxProps {
  isMatched: boolean;
  fullName: string;
  phone?: string;
  whatsapp?: string;
  onUpgradePrompt?: () => void;
}

export function ContactSharingBox({
  isMatched,
  fullName,
  phone = '+880 1712-345678',
  whatsapp = '+880 1712-345678',
  onUpgradePrompt,
}: ContactSharingBoxProps) {
  if (!isMatched) {
    return (
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-brand-wineDark text-white p-6 rounded-3xl shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur text-rose-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-white text-base">
              Verified Contact Details Locked
            </h4>
            <p className="text-xs text-rose-200">
              WhatsApp and contact sharing are protected until mutual acceptance.
            </p>
          </div>
        </div>

        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur text-xs text-stone-300 space-y-1">
          <p>• Mobile Number: <strong>•••• ••••••••</strong></p>
          <p>• WhatsApp Contact: <strong>•••• ••••••••</strong></p>
          <p>• Email Address: <strong>••••••••@••••.com</strong></p>
        </div>

        <p className="text-[11px] text-stone-400 italic">
          To protect {fullName.split(' ')[0]}'s privacy, verified phone and WhatsApp details unlock only after both members express mutual interest.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-md space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur text-emerald-300">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-white text-base">
            Contact Sharing Unlocked!
          </h4>
          <p className="text-xs text-emerald-200">
            You and {fullName.split(' ')[0]} have mutually matched.
          </p>
        </div>
      </div>

      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur text-xs text-white space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-300" /> Phone:
          </span>
          <strong className="font-mono">{phone}</strong>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-2">
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-300" /> WhatsApp:
          </span>
          <strong className="font-mono">{whatsapp}</strong>
        </div>
      </div>
    </div>
  );
}

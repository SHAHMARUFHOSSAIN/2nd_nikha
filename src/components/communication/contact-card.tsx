'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, CheckCircle2, ShieldCheck, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ContactCardProps {
  contactDetails?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  isSender?: boolean;
  phone?: string;
  whatsapp?: string;
  email?: string;
  senderName?: string;
  isOwn?: boolean;
}

export function ContactCard({
  contactDetails,
  isSender,
  phone = '+880 1712-345678',
  whatsapp = '+880 1712-345678',
  email = 'contact@example.com',
  senderName = 'Match',
  isOwn = false,
}: ContactCardProps) {
  const [showManage, setShowManage] = useState(false);

  const actualPhone = contactDetails?.phone || phone;
  const actualWhatsApp = contactDetails?.whatsapp || whatsapp;
  const actualEmail = contactDetails?.email || email;
  const actualIsOwn = isSender !== undefined ? isSender : isOwn;

  const handleWhatsAppClick = () => {
    alert(`Opening WhatsApp deep link for ${actualWhatsApp}... (Mock Action)`);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 rounded-3xl shadow-md space-y-3 max-w-md my-2">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-sm text-white">
            {actualIsOwn ? 'You Shared Contact Details' : `${senderName} Shared Contact Details`}
          </span>
        </div>
        {actualIsOwn && (
          <button
            onClick={() => setShowManage(!showManage)}
            className="text-[10px] text-emerald-200 hover:text-white flex items-center gap-1 underline"
          >
            <Settings className="w-3 h-3" />
            Manage
          </button>
        )}
      </div>

      <div className="space-y-2 text-xs bg-white/10 p-3 rounded-2xl backdrop-blur">
        {actualWhatsApp && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-stone-200">
              <MessageCircle className="w-4 h-4 text-emerald-300" /> WhatsApp:
            </span>
            <strong className="font-mono text-white">{actualWhatsApp}</strong>
          </div>
        )}
        {actualPhone && (
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-stone-200">
              <Phone className="w-4 h-4 text-emerald-300" /> Phone:
            </span>
            <strong className="font-mono text-white">{phone}</strong>
          </div>
        )}
        {email && (
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-stone-200">
              <Mail className="w-4 h-4 text-emerald-300" /> Email:
            </span>
            <strong className="font-mono text-white">{email}</strong>
          </div>
        )}
      </div>

      {whatsapp && !isOwn && (
        <Button
          variant="secondary"
          size="sm"
          onClick={handleWhatsAppClick}
          className="w-full justify-center bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold shadow-sm"
          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
        >
          Continue on WhatsApp
        </Button>
      )}

      {showManage && isOwn && (
        <div className="p-2 bg-white/10 rounded-xl text-[10px] text-stone-200 space-y-1 animate-in fade-in">
          <p className="font-bold text-white">Contact Permissions:</p>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" defaultChecked className="rounded text-emerald-600" /> Phone Visible
          </label>
          <label className="flex items-center gap-1.5">
            <input type="checkbox" defaultChecked className="rounded text-emerald-600" /> WhatsApp Visible
          </label>
        </div>
      )}
    </div>
  );
}

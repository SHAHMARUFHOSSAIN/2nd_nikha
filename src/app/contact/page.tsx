import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { FinalCta } from '@/components/sections/final-cta';
import { BRAND_NAME } from '@/lib/constants';
import { Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: `Contact Us & Support | ${BRAND_NAME}`,
  description: 'Reach out to 2nd Chance matrimonial support team, matchmakers, or office locations.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 space-y-12 bg-stone-50/50">
      <Container size="xl">
        <SectionHeading
          eyebrow="24/7 Matchmaker Support"
          title="We Are Here To Assist Your Remarriage Journey"
          highlightWord="Assist Your"
          subtitle="Have questions about profile verification, privacy controls, or membership upgrade? Contact our team anytime."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto text-xl font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Phone & WhatsApp</h3>
            <p className="text-xs text-stone-500">+880 1700-000000</p>
            <p className="text-[11px] text-pink-600 font-bold">Available 9:00 AM - 10:00 PM BDT</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto text-xl font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Official Email</h3>
            <p className="text-xs text-stone-500">support@2ndchancematrimonial.com</p>
            <p className="text-[11px] text-pink-600 font-bold">Fast response within 2 hours</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto text-xl font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">Office Sanctuary</h3>
            <p className="text-xs text-stone-500">Gulshan 2, Dhaka 1212, Bangladesh</p>
            <p className="text-[11px] text-pink-600 font-bold">In-person support by appointment</p>
          </div>
        </div>
      </Container>

      <FinalCta />
    </div>
  );
}

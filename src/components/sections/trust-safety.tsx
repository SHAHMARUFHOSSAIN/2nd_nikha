import React from 'react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ShieldCheck, Lock, UserCheck, PhoneCall, AlertTriangle, FileText } from 'lucide-react';

export function TrustSafety() {
  const steps = [
    {
      step: '01',
      icon: <FileText className="w-6 h-6 text-rose-600" />,
      title: 'National ID & Identity Check',
      description:
        'Members verify their government National ID (NID/Passport) and phone number during registration.',
    },
    {
      step: '02',
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Marital Status Declaration',
      description:
        'Honest disclosure of divorce decree or spousal death certificate guarantees authentic background transparency.',
    },
    {
      step: '03',
      icon: <Lock className="w-6 h-6 text-brand-wine" />,
      title: 'Private Photo Protection',
      description:
        'Your photos are protected behind strict permission filters. Control who can view your full image gallery.',
    },
    {
      step: '04',
      icon: <PhoneCall className="w-6 h-6 text-amber-600" />,
      title: 'Mutual Acceptance Guardrail',
      description:
        'No unsolicited messages or calls. Direct chat and contact details unlock only after both parties agree.',
    },
  ];

  return (
    <section id="trust" className="py-20 bg-rose-50/40 relative">
      <Container size="xl">
        <SectionHeading
          eyebrow="Safety & Trust Guarantee"
          title="Your Privacy & Security Are Our Highest Priorities"
          highlightWord="Security"
          subtitle="We build trust through multi-layer verification so you can explore matches with total confidence and peace of mind."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-4 right-4 text-3xl font-serif font-black text-rose-100">
                {item.step}
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-rose-50 w-fit">
                  {item.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

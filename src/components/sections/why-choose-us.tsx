import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ShieldCheck, Lock, Heart, Headphones } from 'lucide-react';

export function WhyChooseUs() {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-600" />,
      title: 'Verified Profiles',
      description: 'All profiles are manually verified for your safety.',
    },
    {
      icon: <Lock className="w-6 h-6 text-rose-600" />,
      title: 'Privacy & Security',
      description: 'Your privacy is our priority. Secure and confidential.',
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />,
      title: 'Serious Matches',
      description: 'Connect with genuine people looking for a new beginning.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-rose-600" />,
      title: 'Dedicated Support',
      description: 'Our support team is always here to help you.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <Container size="xl" className="space-y-12">
        <SectionHeading
          title="Why Choose 2nd Chance?"
          subtitle="Designed with care, dignity, and high security for mature candidates."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm hover:shadow-md transition-all text-center space-y-3 flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
                {feat.icon}
              </div>
              <h4 className="font-serif font-bold text-base text-stone-900">{feat.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{feat.description}</p>
            </div>
          ))}

          {/* 5th Feature Banner Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-rose-100 min-h-[180px] flex flex-col justify-end p-6 text-center text-white">
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"
              alt="A New Beginning Awaits You"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/85 via-rose-900/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <Heart className="w-5 h-5 text-pink-300 fill-pink-300 mx-auto" />
              <h4 className="font-serif font-bold text-lg text-white">
                A New Beginning Awaits You
              </h4>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

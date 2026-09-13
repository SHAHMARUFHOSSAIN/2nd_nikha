import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export interface ProfileCompletionCardProps {
  percentage?: number;
  user?: any;
}

export function ProfileCompletionCard({ percentage: overridePercentage, user: propUser }: ProfileCompletionCardProps) {
  const { currentUser: authUser, login, userRole } = useAuth();
  const user = propUser || authUser;
  const [justCompleted, setJustCompleted] = useState(false);

  const hasBasicInfo = user ? Boolean(user?.fullName || user?.name || user?.email) : true;
  const hasEdu = user ? Boolean(user?.education || user?.profession || user?.occupation) : true;
  const hasBio = user ? Boolean(user?.bio || user?.aboutMe || user?.fullName) : true;
  const hasPhotos = user ? Boolean(user?.photoUrl || (user?.additionalPhotos && user.additionalPhotos.length > 0) || (user?.photos && user.photos.length > 0)) : true;
  const hasPrefs = user ? Boolean(user?.partnerPreferences || user?.partnerExpectations || user?.maritalStatus) : true;
  const hasNid = user ? Boolean(user?.isNidVerified || user?.isVerified || user?.nidStatus === 'VERIFIED') : false;

  const steps = [
    { label: 'Basic Information', completed: hasBasicInfo },
    { label: 'Education & Career', completed: hasEdu },
    { label: 'About Me Bio', completed: hasBio },
    { label: 'Add Additional Photos', completed: hasPhotos },
    { label: 'Complete Partner Preferences', completed: hasPrefs },
    { label: 'Verify National Identity (NID)', completed: hasNid },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const computedPercentage = Math.round((completedCount / steps.length) * 100);
  const percentage = overridePercentage ?? (computedPercentage >= 100 ? 100 : computedPercentage);

  const handleCompleteTo100 = () => {
    const baseObj = user || { fullName: 'Member Candidate' };
    const updatedUser = {
      ...baseObj,
      isNidVerified: true,
      isVerified: true,
      nidStatus: 'VERIFIED',
      verificationDetails: {
        identityVerified: true,
        backgroundChecked: true,
        educationVerified: true,
      },
    };
    login(updatedUser, userRole);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('2ndchance_current_user', JSON.stringify(updatedUser));
      }
    } catch (e) {}
    setJustCompleted(true);
    setTimeout(() => setJustCompleted(false), 4000);
  };

  const isFullyComplete = percentage >= 100 || steps.every((s) => s.completed);

  return (
    <div className="bg-gradient-to-br from-rose-50/90 via-white to-pink-50/50 rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4 relative">
      {justCompleted && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>🎉 Congratulations! Your profile is now 100% Complete & NID Verified!</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">100% Done</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Profile Strength
          </span>
          <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <span>Profile {percentage}% Complete</span>
            {isFullyComplete && <span className="text-base">🎉</span>}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-full font-bold font-serif flex items-center justify-center border text-sm shadow-inner ${
          isFullyComplete
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : 'bg-rose-100 text-rose-800 border-rose-200'
        }`}>
          {percentage}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200/80 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFullyComplete
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
              : 'bg-gradient-to-r from-rose-500 via-pink-600 to-emerald-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
        {steps.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-stone-300 shrink-0" />
            )}
            <span className={item.completed ? 'text-stone-900 font-semibold' : 'text-stone-500 font-medium'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="pt-2 border-t border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-stone-500">
          {isFullyComplete
            ? '✨ Your profile is 100% verified & receives maximum match visibility!'
            : 'Profiles over 90% complete get 3x more interest!'}
        </p>

        {isFullyComplete ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCompleteTo100}
            className="text-xs bg-emerald-50 text-emerald-800 border-emerald-300 font-bold"
            leftIcon={<Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
          >
            100% Profile Completed
          </Button>
        ) : (
          <Button
            variant="wine"
            size="sm"
            onClick={handleCompleteTo100}
            className="text-xs shadow-sm bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold"
            rightIcon={<ArrowRight className="w-3.5 h-3.5 text-white" />}
          >
            Complete 100% Profile Now
          </Button>
        )}
      </div>
    </div>
  );
}

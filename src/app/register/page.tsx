'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ImageUploader } from '@/components/ui/image-uploader';
import { MARITAL_STATUS_OPTIONS, RELIGION_OPTIONS, BRAND_NAME } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';
import {
  CheckCircle2,
  Heart,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Upload,
  User,
  BookOpen,
  Briefcase,
  Users,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

import { useAdmin } from '@/lib/admin-context';

export default function RegistrationWizardPage() {
  const router = useRouter();
  const { login, userRole } = useAuth();
  const { addMember } = useAdmin();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    email: '',
    phone: '',
    password: '',
    gender: 'Female',
    // Step 2
    dob: '1994-05-15',
    religion: 'Islam',
    motherTongue: 'Bengali',
    country: 'Bangladesh',
    city: 'Dhaka',
    maritalStatus: 'Divorced',
    // Step 3
    hasChildren: 'Yes',
    childrenCount: '1',
    childrenLivingWith: 'Living with mother',
    familyType: 'Nuclear Family',
    familyLocation: 'Dhaka',
    // Step 4
    education: 'MSc in Computer Science',
    institution: 'University of Dhaka',
    profession: 'Software Engineer',
    company: 'Tech Solutions',
    income: '৳1,50,000 / month',
    // Step 5
    height: "5'4\"",
    languages: 'Bengali, English',
    lifestyle: 'Non-smoker',
    hobbies: 'Reading, Gardening, Music',
    // Step 6
    bio: 'I am a resilient, warm-hearted professional looking for an honest, emotionally mature companion for a lifelong second chapter.',
    // Step 7
    prefGender: 'Male',
    prefAgeRange: '32 - 42',
    prefReligion: 'Islam',
    prefLocation: 'Dhaka / Overseas',
    prefEducation: 'Graduate degree',
    prefMaritalStatus: 'Divorced, Widowed, Single Parent',
    // Step 8
    photoUrl: '',
    photos: ['', '', '', ''],
    photoPrivacy: 'PUBLIC',
  });

  const updatePhotoSlot = (index: number, val: string) => {
    setStepError(null);
    setFormData((prev) => {
      const currentList = Array.isArray(prev.photos) ? [...prev.photos] : ['', '', '', ''];
      currentList[index] = val;
      const firstValid = currentList.find((p) => Boolean(p && p.trim())) || val;
      return {
        ...prev,
        photos: currentList,
        photoUrl: firstValid,
      };
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCustomerStr = localStorage.getItem('2ndchance_checkout_customer');
        if (savedCustomerStr) {
          const cust = JSON.parse(savedCustomerStr);
          setFormData((prev) => ({
            ...prev,
            fullName: cust.fullName || prev.fullName,
            email: cust.email || prev.email,
            phone: cust.phone || prev.phone,
          }));
        }
      } catch (e) {}
    }
  }, []);

  const [stepError, setStepError] = useState<string | null>(null);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const updateField = (field: string, val: string) => {
    setStepError(null);
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const validateCurrentStep = (): boolean => {
    setStepError(null);
    if (currentStep === 1) {
      if (!formData.fullName.trim()) { setStepError('Full Name is required for profile creation.'); return false; }
      if (!formData.email.trim() || !formData.email.includes('@')) { setStepError('A valid Email Address is required.'); return false; }
      if (!formData.phone.trim() || formData.phone.length < 10) { setStepError('A valid Phone Number is required.'); return false; }
      if (!formData.password || formData.password.length < 6) { setStepError('Password must be at least 6 characters.'); return false; }
    }
    if (currentStep === 2) {
      if (!formData.dob) { setStepError('Date of Birth is required.'); return false; }
      if (!formData.motherTongue.trim()) { setStepError('Mother Tongue is required.'); return false; }
      if (!formData.country.trim()) { setStepError('Country is required.'); return false; }
      if (!formData.city.trim()) { setStepError('City / Location is required.'); return false; }
    }
    if (currentStep === 3) {
      if (formData.hasChildren === 'Yes' && !formData.childrenLivingWith.trim()) {
        setStepError('Please specify Children Custody details.'); return false;
      }
      if (!formData.familyLocation.trim()) { setStepError('Family Location is required.'); return false; }
    }
    if (currentStep === 4) {
      if (!formData.education.trim()) { setStepError('Highest Qualification is required.'); return false; }
      if (!formData.institution.trim()) { setStepError('Institution / University is required.'); return false; }
      if (!formData.profession.trim()) { setStepError('Profession is required.'); return false; }
      if (!formData.company.trim()) { setStepError('Company / Employer name is required.'); return false; }
    }
    if (currentStep === 5) {
      if (!formData.languages.trim()) { setStepError('Languages spoken is required.'); return false; }
      if (!formData.hobbies.trim()) { setStepError('Hobbies & Interests are required.'); return false; }
    }
    if (currentStep === 6) {
      if (!formData.bio.trim() || formData.bio.trim().length < 15) {
        setStepError('Please write a brief bio about yourself (at least 15 characters).'); return false;
      }
    }
    // Step 8: Photos are optional & skippable
    if (currentStep === 9) {
      if (!termsAgreed) {
        const isBD = formData.country.toLowerCase() === 'bangladesh' || formData.country.toLowerCase() === 'bd';
        setStepError(
          isBD
            ? 'রেজিস্ট্রেশন সম্পূর্ণ করতে হলে আপনাকে অবশ্যই শর্তাবলি পড়ে টিকচিহ্ন (✓) প্রদান করে সম্মত হতে হবে।'
            : 'You must read and check the agreement box before completing registration.'
        );
        return false;
      }
    }
    return true;
  };

  const steps = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'Basic Info' },
    { num: 3, label: 'Family' },
    { num: 4, label: 'Career' },
    { num: 5, label: 'Lifestyle' },
    { num: 6, label: 'About Me' },
    { num: 7, label: 'Partner Pref' },
    { num: 8, label: 'Photos' },
    { num: 9, label: 'Review' },
  ];

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const validPhotosList = (formData.photos || []).filter((p) => Boolean(p && p.trim()));
      const avatarUrl = validPhotosList[0] || formData.photoUrl || (formData.gender === 'Male'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600');

      const newProfile = {
        id: `p-${Date.now()}`,
        fullName: formData.fullName || 'New Member',
        email: formData.email,
        phone: formData.phone,
        age: formData.dob ? Math.max(18, new Date().getFullYear() - new Date(formData.dob).getFullYear()) : 28,
        gender: formData.gender || 'Female',
        height: formData.height || "5'5\"",
        maritalStatus: formData.maritalStatus || 'Divorced',
        religion: formData.religion || 'Islam',
        motherTongue: formData.motherTongue || 'Bengali',
        location: `${formData.city || 'Dhaka'}, ${formData.country || 'Bangladesh'}`,
        city: formData.city || 'Dhaka',
        country: formData.country || 'Bangladesh',
        countryFlag: formData.country === 'Bangladesh' ? '🇧🇩' : '🌐',
        education: formData.education || 'Graduate',
        institution: formData.institution || 'University',
        profession: formData.profession || 'Professional',
        company: formData.company || 'Enterprise',
        income: formData.income || '৳1,00,000 / month',
        bio: formData.bio || 'Seeking a genuine, respectful life partner for remarriage.',
        photoUrl: avatarUrl,
        photos: validPhotosList.length > 0 ? validPhotosList : [avatarUrl],
        isVerified: false,
        matchPercentage: 92,
        trustScore: 88,
        hasChildren: Boolean(formData.childrenCount && Number(formData.childrenCount) > 0),
        photoPrivacy: 'PUBLIC' as const,
        membershipTier: (userRole === 'PREMIUM' ? 'Premium' : 'Free') as any,
        matchReasons: ['Location Match', 'Education Compatibility', 'Religiosity'],
        partnerPreferences: {
          ageRange: '24-35',
          maritalStatuses: ['Divorced', 'Single Parent'],
          religion: 'Islam',
          minHeight: "5'2\"",
          education: 'Graduate',
          location: 'Dhaka',
        },
        createdAt: new Date().toISOString().split('T')[0],
      };

      const isPaidUser = userRole === 'PREMIUM';
      login(newProfile, isPaidUser ? 'PREMIUM' : 'FREE');
      try {
        addMember(newProfile);
      } catch (e) {}
      setIsCompleted(true);

      try {
        fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProfile),
        }).catch(() => {});
      } catch (e) {}
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  if (isCompleted) {
    const isPaid = userRole === 'PREMIUM';
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 bg-rose-50/30">
        <Container size="sm">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-brand-wine text-white flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Please Wait For Your Perfect Match ❤️</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-stone-900">
                Registration Complete, {formData.fullName || 'Member'}!
              </h1>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-medium">
                {isPaid
                  ? 'Your profile setup is complete! Please wait for your perfect match — our smart AI engine & verification team are matching your profile with verified candidates.'
                  : 'Your profile registration is complete! Please select a subscription pass below to activate your account and view your perfect matches.'}
              </p>
            </div>

            {isPaid ? (
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs text-stone-700 text-left space-y-1.5">
                <p className="font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Full Access Unlocked</span>
                </p>
                <p>• Unlimited AI Matches, Verified Profiles & Photo Access.</p>
                <p>• Direct Messaging & WhatsApp contact sharing.</p>
                <p>• Priority 24/7 Match Assistance.</p>
              </div>
            ) : (
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-stone-700 text-left space-y-1.5">
                <p className="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Mandatory Pass Activation</span>
                </p>
                <p>• A subscription pass is required to access the member portal and features.</p>
                <p>• Instant access to AI Matches, Verified Profiles, and Mutual Chatting.</p>
                <p>• Flexible payment options via PayStation (bKash, Nagad, Cards).</p>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="wine"
                size="lg"
                onClick={() => router.push(isPaid ? '/member' : '/membership?required=true')}
                className="w-full justify-center shadow-lg shadow-rose-900/20 font-bold"
                rightIcon={<ArrowRight className="w-5 h-5 text-white" />}
              >
                {isPaid ? 'Go to My Member Dashboard & View Matches' : 'Choose Subscription Pass & Activate Account'}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12 bg-gradient-to-b from-rose-50/40 via-white to-pink-50/30">
      <Container size="md">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rose-100 pb-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-brand-wine flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-serif font-bold text-xl text-stone-900">
                {BRAND_NAME}
              </span>
            </Link>
            <span className="text-xs font-semibold text-stone-500">
              Step {currentStep} of 9
            </span>
          </div>

          {/* Progress Bar & Indicators */}
          <div className="space-y-2">
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-brand-wine h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 9) * 100}%` }}
              />
            </div>
            <div className="flex justify-between overflow-x-auto text-[11px] font-semibold text-stone-500 pt-1">
              {steps.map((s) => (
                <span
                  key={s.num}
                  className={
                    currentStep === s.num
                      ? 'text-rose-700 font-bold underline'
                      : currentStep > s.num
                      ? 'text-emerald-700'
                      : 'text-stone-400'
                  }
                >
                  {s.num}. {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Wizard Card Body */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-xl space-y-6">
            {stepError && (
              <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-xs flex items-center gap-2.5 font-medium animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{stepError}</span>
              </div>
            )}

            {/* Step 1: Account */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Step 1: Account Information
                </h2>
                <Input
                  label="Full Name"
                  placeholder="e.g. Anika Rahman"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="01712345678"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                  />
                  <Select
                    label="Gender"
                    options={['Female', 'Male']}
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Basic Info */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Step 2: Basic Profile Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateField('dob', e.target.value)}
                  />
                  <Select
                    label="Religion"
                    options={[...RELIGION_OPTIONS]}
                    value={formData.religion}
                    onChange={(e) => updateField('religion', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Mother Tongue"
                    value={formData.motherTongue}
                    onChange={(e) => updateField('motherTongue', e.target.value)}
                  />
                  <Select
                    label="Marital Status"
                    options={formData.gender === 'Male' ? [...MARITAL_STATUS_OPTIONS] : MARITAL_STATUS_OPTIONS.filter((o) => o !== 'Married')}
                    value={formData.maritalStatus}
                    onChange={(e) => updateField('maritalStatus', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Country"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                  />
                  <Input
                    label="City / Location"
                    placeholder="e.g. Gulshan, Dhaka"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Family & Children */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Step 3: Family & Children Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Select
                    label="Has Children?"
                    options={['Yes', 'No']}
                    value={formData.hasChildren}
                    onChange={(e) => updateField('hasChildren', e.target.value)}
                  />
                  {formData.hasChildren === 'Yes' && (
                    <>
                      <Select
                        label="Number of Children"
                        options={['1', '2', '3', '4+']}
                        value={formData.childrenCount}
                        onChange={(e) => updateField('childrenCount', e.target.value)}
                      />
                      <Input
                        label="Children Custody"
                        placeholder="e.g. Living with mother"
                        value={formData.childrenLivingWith}
                        onChange={(e) => updateField('childrenLivingWith', e.target.value)}
                      />
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    label="Family Type"
                    options={['Nuclear Family', 'Joint / Close-knit Family', 'Traditional Family']}
                    value={formData.familyType}
                    onChange={(e) => updateField('familyType', e.target.value)}
                  />
                  <Input
                    label="Family Location"
                    placeholder="e.g. Dhaka, Bangladesh"
                    value={formData.familyLocation}
                    onChange={(e) => updateField('familyLocation', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Education & Career */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Step 4: Education & Professional Career
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Highest Qualification"
                    placeholder="e.g. MSc in Computer Science"
                    value={formData.education}
                    onChange={(e) => updateField('education', e.target.value)}
                  />
                  <Input
                    label="Institution / University"
                    placeholder="e.g. Dhaka University"
                    value={formData.institution}
                    onChange={(e) => updateField('institution', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Profession"
                    placeholder="e.g. Lead Tech Lead"
                    value={formData.profession}
                    onChange={(e) => updateField('profession', e.target.value)}
                  />
                  <Input
                    label="Company / Employer"
                    placeholder="e.g. Brain Station 23"
                    value={formData.company}
                    onChange={(e) => updateField('company', e.target.value)}
                  />
                  <Select
                    label="Income Range"
                    options={[
                      'Below ৳50,000 / month',
                      '৳50,000 - ৳1,00,000 / month',
                      '৳1,00,000 - ৳2,00,000 / month',
                      'Above ৳2,00,000 / month',
                    ]}
                    value={formData.income}
                    onChange={(e) => updateField('income', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Lifestyle */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Step 5: Lifestyle & Personal Habits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    label="Height"
                    options={["5'2\"", "5'4\"", "5'6\"", "5'8\"", "5'10\"", "6'0\""]}
                    value={formData.height}
                    onChange={(e) => updateField('height', e.target.value)}
                  />
                  <Input
                    label="Spoken Languages"
                    placeholder="e.g. Bengali, English"
                    value={formData.languages}
                    onChange={(e) => updateField('languages', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Lifestyle Values"
                    placeholder="e.g. Non-smoker, Moderate religious"
                    value={formData.lifestyle}
                    onChange={(e) => updateField('lifestyle', e.target.value)}
                  />
                  <Input
                    label="Hobbies & Interests"
                    placeholder="e.g. Reading, Travel, Cooking"
                    value={formData.hobbies}
                    onChange={(e) => updateField('hobbies', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 6: About Me */}
            {currentStep === 6 && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Step 6: About Yourself
                </h2>

                {/* Privacy Alert Warning */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Privacy Reminder:</strong> Please avoid sharing phone numbers, email addresses, WhatsApp details, or social media handles in your public bio.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Tell Potential Matches About Yourself
                  </label>
                  <textarea
                    rows={5}
                    value={formData.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl p-3.5 text-stone-900 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                  <p className="text-xs text-right text-stone-400">
                    {formData.bio.length} characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 7: Partner Preferences */}
            {currentStep === 7 && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Step 7: Partner Preferences
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    label="Preferred Gender"
                    options={['Male', 'Female']}
                    value={formData.prefGender}
                    onChange={(e) => updateField('prefGender', e.target.value)}
                  />
                  <Select
                    label="Preferred Religion"
                    options={['Same Religion', 'Any Religion', ...RELIGION_OPTIONS]}
                    value={formData.prefReligion}
                    onChange={(e) => updateField('prefReligion', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Preferred Age Range"
                    placeholder="e.g. 32 - 42"
                    value={formData.prefAgeRange}
                    onChange={(e) => updateField('prefAgeRange', e.target.value)}
                  />
                  <Input
                    label="Preferred Location"
                    placeholder="e.g. Dhaka / Overseas"
                    value={formData.prefLocation}
                    onChange={(e) => updateField('prefLocation', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 8: Photos & Gallery */}
            {currentStep === 8 && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900">
                      Step 8: Photos & Privacy Settings (Up to 4 Photos)
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Upload up to 4 photos for your public profile. You can also skip this step and add photos later.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStepError(null);
                      setCurrentStep(9);
                    }}
                    className="self-start sm:self-auto rounded-full text-xs border-amber-300 bg-amber-50 text-amber-900 font-bold hover:bg-amber-100"
                  >
                    Skip Photo Upload →
                  </Button>
                </div>

                {/* 4 Photo Upload Slots Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((slotIdx) => (
                    <div key={slotIdx} className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-2">
                      <ImageUploader
                        label={`Photo ${slotIdx + 1} ${slotIdx === 0 ? '(Main Profile Photo)' : '(Gallery Photo)'}`}
                        helperText={slotIdx === 0 ? 'Primary photo displayed on profile cards.' : 'Additional photo for gallery.'}
                        value={formData.photos?.[slotIdx] || (slotIdx === 0 ? formData.photoUrl : '')}
                        onChange={(val) => updatePhotoSlot(slotIdx, val)}
                      />
                    </div>
                  ))}
                </div>

                <Select
                  label="Photo Privacy Setting"
                  options={[
                    { value: 'PUBLIC', label: 'PUBLIC - Visible to all verified visitors' },
                    { value: 'PRIVATE', label: 'PRIVATE - Lock gallery until explicitly granted' },
                    { value: 'PREMIUM_ONLY', label: 'PREMIUM ONLY - Visible to active Premium members' },
                    { value: 'MATCH_ONLY', label: 'MATCH ONLY - Visible after mutual interest accept' },
                  ]}
                  value={formData.photoPrivacy}
                  onChange={(e) => updateField('photoPrivacy', e.target.value)}
                />
              </div>
            )}

            {/* Step 9: Terms Declaration & Final Agreement */}
            {currentStep === 9 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900">
                    Step 9: Terms Declaration & User Consent
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Please review your profile details and read our declaration before final registration.
                  </p>
                </div>

                {/* Profile Summary Card */}
                <div className="space-y-2 bg-stone-50 p-4 rounded-3xl border border-stone-200 text-xs text-stone-700">
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span className="font-bold text-stone-900">Full Name:</span>
                    <span>{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span className="font-bold text-stone-900">Marital Status & Religion:</span>
                    <span>{formData.maritalStatus} ({formData.religion})</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span className="font-bold text-stone-900">Profession & Education:</span>
                    <span>{formData.profession} ({formData.education})</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span className="font-bold text-stone-900">Location:</span>
                    <span>{formData.city}, {formData.country}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block mb-1">About Me:</span>
                    <p className="italic bg-white p-2.5 rounded-2xl border border-stone-200 leading-relaxed text-stone-800">
                      "{formData.bio}"
                    </p>
                  </div>
                </div>

                {/* Terms & Legal Declaration Box (Bengali for Bangladesh, English for International) */}
                {formData.country.toLowerCase() === 'bangladesh' || formData.country.toLowerCase() === 'bd' ? (
                  /* BENGALI LEGAL DECLARATION & CONSENT FOR BANGLADESH */
                  <div className="space-y-3 bg-emerald-50/50 p-4 sm:p-5 rounded-3xl border border-emerald-200 text-xs text-stone-800">
                    <div className="flex items-center gap-2 text-emerald-900 font-serif font-bold text-base border-b border-emerald-200 pb-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>গুরুত্বপূর্ণ ঘোষণা ও ব্যবহারকারীর সম্মতি</span>
                    </div>

                    <div className="max-h-[260px] overflow-y-auto space-y-3 pr-2 leading-relaxed text-stone-700 text-xs">
                      <p>
                        <strong>2ndNikah.com</strong> একটি অনলাইন ম্যাট্রিমনি প্ল্যাটফর্ম, যার উদ্দেশ্য হলো বিবাহের উদ্দেশ্যে প্রাপ্তবয়স্ক ব্যক্তিদের মধ্যে পরিচিত হওয়ার একটি মাধ্যম প্রদান করা। 2ndNikah.com কোনো বিবাহের নিশ্চয়তা প্রদান করে না এবং ব্যবহারকারীদের ব্যক্তিগত সিদ্ধান্তের জন্য দায়ী নয়।
                      </p>

                      <p>
                        প্রত্যেক ব্যবহারকারী নিজের সিদ্ধান্ত, যোগাযোগ ও কার্যকলাপের জন্য নিজেই দায়ী থাকবেন। কোনো ব্যক্তির সঙ্গে যোগাযোগ, সম্পর্ক বা বিবাহের সিদ্ধান্ত নেওয়ার আগে তার পরিচয়, বৈবাহিক অবস্থা, পারিবারিক ও অন্যান্য গুরুত্বপূর্ণ তথ্য যথাযথভাবে যাচাই করুন। প্রয়োজনে নিজের অভিভাবক, পরিবারের সদস্য বা বিশ্বস্ত ব্যক্তিদের সঙ্গে পরামর্শ করে সিদ্ধান্ত নিন।
                      </p>

                      <p>
                        ব্যবহারকারীদের দেওয়া তথ্য সম্পূর্ণ সঠিক বা নির্ভুল—এমন কোনো নিশ্চয়তা 2ndNikah.com প্রদান করে না। তাই অন্য কোনো ব্যবহারকারীর তথ্যের ওপর নির্ভর করার আগে নিজ দায়িত্বে যাচাই করুন।
                      </p>

                      <p>
                        ব্যবহারকারীদের মধ্যকার ব্যক্তিগত যোগাযোগ, সাক্ষাৎ, বিবাহ, আর্থিক লেনদেন, উপহার, অর্থ প্রদান, প্রতারণা, ব্যক্তিগত বিরোধ, ক্ষতি বা অন্য কোনো কার্যকলাপের জন্য প্রযোজ্য আইন যতটুকু অনুমতি দেয়, তার সীমার মধ্যে 2ndNikah.com কর্তৃপক্ষ কোনো দায়ভার গ্রহণ করে না।
                      </p>

                      <p>
                        কোনো ব্যবহারকারী অশালীন, অনৈতিক, প্রতারণামূলক, হয়রানিমূলক বা বেআইনি কোনো কাজে লিপ্ত হলে তার সম্পূর্ণ দায়ভার সংশ্লিষ্ট ব্যবহারকারীর নিজের। 2ndNikah.com এ ধরনের কার্যকলাপের বিরুদ্ধে প্রয়োজনীয় ব্যবস্থা নেওয়ার অধিকার সংরক্ষণ করে এবং প্রযোজ্য আইন অনুযায়ী সংশ্লিষ্ট কর্তৃপক্ষের সঙ্গে সহযোগিতা করতে পারে।
                      </p>

                      <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-200 space-y-2 text-stone-800">
                        <h4 className="font-serif font-bold text-amber-900 text-sm flex items-center gap-1.5">
                          <span>🕌</span>
                          <span>ইসলামী সতর্কতা</span>
                        </h4>
                        <p>
                          এই প্ল্যাটফর্মটি হালালভাবে বিবাহের উদ্দেশ্যে পরিচিত হওয়ার একটি মাধ্যম মাত্র। প্রত্যেক মুসলিম ব্যবহারকারীকে আল্লাহর প্রতি জবাবদিহিতার কথা স্মরণ রেখে শালীনতা, সততা ও ইসলামী আদব-আখলাক বজায় রেখে প্ল্যাটফর্মটি ব্যবহার করার জন্য অনুরোধ করা হচ্ছে।
                        </p>
                        <p>
                          কোনো ব্যবহারকারী যদি এই প্ল্যাটফর্মের মাধ্যমে পরিচিত হয়ে অশালীনতা, প্রতারণা, অবৈধ সম্পর্ক, অন্যায় বা অন্য কোনো অনৈতিক কাজে নিজেকে জড়িয়ে ফেলেন, তবে সেই কাজের দায়ভার সম্পূর্ণভাবে সংশ্লিষ্ট ব্যক্তির নিজের।
                        </p>
                        <p className="font-semibold text-amber-950">
                          এ ধরনের ব্যক্তিগত কাজ, সিদ্ধান্ত বা গুনাহের জন্য 2ndNikah.com কর্তৃপক্ষ দুনিয়া ও আখিরাতে কোনো দায়ভার গ্রহণ করবে না।
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-2xl border border-emerald-200 space-y-1">
                        <h4 className="font-serif font-bold text-emerald-900 text-xs">ব্যবহারকারীর সম্মতি</h4>
                        <p className="text-[11px] text-stone-700">
                          “Accept & Continue” বাটনে ক্লিক করার মাধ্যমে আমি ঘোষণা করছি যে আমি উপরোক্ত বিষয়গুলো পড়েছি, বুঝেছি এবং সম্মত হয়েছি। আমি বুঝতে পারছি যে 2ndNikah.com শুধুমাত্র বিবাহের উদ্দেশ্যে পরিচিত হওয়ার একটি মাধ্যম এবং আমার নিজের সিদ্ধান্ত ও কার্যকলাপের দায়ভার আমার নিজের।
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ENGLISH LEGAL DECLARATION & CONSENT FOR INTERNATIONAL VISITORS */
                  <div className="space-y-3 bg-emerald-50/50 p-4 sm:p-5 rounded-3xl border border-emerald-200 text-xs text-stone-800">
                    <div className="flex items-center gap-2 text-emerald-900 font-serif font-bold text-base border-b border-emerald-200 pb-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>Important Notice & User Consent</span>
                    </div>

                    <div className="max-h-[260px] overflow-y-auto space-y-3 pr-2 leading-relaxed text-stone-700 text-xs">
                      <p>
                        <strong>2ndNikah.com</strong> is an online matrimonial platform intended to provide a means for adults to connect with one another for the purpose of marriage. 2ndNikah.com does not guarantee marriage and is not responsible for users’ personal decisions or actions.
                      </p>

                      <p>
                        Each user is solely responsible for their own decisions, communications, and activities. Before communicating with, developing a relationship with, or considering marriage with another person, you are strongly advised to independently verify their identity, marital status, family background, and other relevant information. Where appropriate, consult your parents, guardians, family members, or other trusted individuals before making any decision.
                      </p>

                      <p>
                        2ndNikah.com does not guarantee that information provided by users is complete, accurate, authentic, or up to date. Therefore, users must independently verify any information before relying upon it or making decisions based on it.
                      </p>

                      <p>
                        To the maximum extent permitted by applicable law, 2ndNikah.com and its management shall not be held responsible or liable for personal communications, meetings, relationships, marriages, financial transactions, gifts, payments, fraud, personal disputes, losses, damages, or any other activities or interactions between users.
                      </p>

                      <p>
                        If any user engages in indecent, immoral, fraudulent, harassing, unlawful, or otherwise inappropriate activities, the responsibility and consequences shall rest entirely with that user. 2ndNikah.com reserves the right to take appropriate action against such activities and, where required by applicable law, cooperate with the relevant authorities.
                      </p>

                      <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-200 space-y-2 text-stone-800">
                        <h4 className="font-serif font-bold text-amber-900 text-sm flex items-center gap-1.5">
                          <span>🕌</span>
                          <span>Islamic Reminder</span>
                        </h4>
                        <p>
                          This platform is only a means of connecting people for the purpose of marriage in a Halal manner. Muslim users are encouraged to remain mindful of their accountability before Allah and to use this platform with honesty, modesty, respect, and proper Islamic manners.
                        </p>
                        <p>
                          If any user, after becoming acquainted with another person through this platform, engages in indecent behavior, fraud, an unlawful relationship, wrongdoing, or any other immoral or prohibited activity, the responsibility for such actions shall rest entirely with the individual concerned.
                        </p>
                        <p className="font-semibold text-amber-950">
                          2ndNikah.com and its management shall bear no responsibility, in this world or in the Hereafter, for such personal actions, decisions, or sins committed by users.
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-2xl border border-emerald-200 space-y-1">
                        <h4 className="font-serif font-bold text-emerald-900 text-xs">User Consent</h4>
                        <p className="text-[11px] text-stone-700">
                          By clicking “Accept & Continue,” I confirm that I have read, understood, and agreed to the above terms and notices. I understand that 2ndNikah.com is only a means of connecting people for the purpose of marriage, and that I am solely responsible for my own decisions, actions, and activities.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Agreement Checkbox */}
                <label className="flex items-start gap-3 p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 cursor-pointer hover:bg-rose-50 transition-colors shadow-2xs">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => {
                      setStepError(null);
                      setTermsAgreed(e.target.checked);
                    }}
                    className="w-5 h-5 mt-0.5 accent-pink-600 rounded cursor-pointer shrink-0"
                  />
                  <span className="text-xs font-bold text-stone-900 leading-snug">
                    {formData.country.toLowerCase() === 'bangladesh' || formData.country.toLowerCase() === 'bd'
                      ? '✓ আমি উপরোক্ত শর্তাবলি পড়েছি এবং সম্মত আছি'
                      : '✓ I have read and agree to the above terms and conditions'}
                  </span>
                </label>
              </div>
            )}

            {/* Step Controls Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <Button
                variant="outline"
                size="md"
                onClick={handleBack}
                disabled={currentStep === 1}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>

              <Button
                variant="wine"
                size="md"
                onClick={handleNext}
                className="shadow-md shadow-rose-900/20 font-bold px-6"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentStep === 9 ? 'Accept & Continue' : 'Next Step'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

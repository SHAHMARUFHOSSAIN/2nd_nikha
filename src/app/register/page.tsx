'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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

export default function RegistrationWizardPage() {
  const router = useRouter();
  const { setRole } = useAuth();
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
    bio: 'I am a resilient, warm-hearted professional and mother looking for an honest, emotionally mature companion for a lifelong second chapter.',
    // Step 7
    prefGender: 'Male',
    prefAgeRange: '32 - 42',
    prefReligion: 'Islam',
    prefLocation: 'Dhaka / Overseas',
    prefEducation: 'Graduate degree',
    prefMaritalStatus: 'Divorced, Widowed, Single Parent',
    // Step 8
    photoPrivacy: 'PUBLIC',
  });

  const updateField = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
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
    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      setRole('FREE');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  if (isCompleted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 bg-rose-50/30">
        <Container size="sm">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-brand-wine text-white flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                Profile Created Successfully
              </span>
              <h1 className="text-3xl font-serif font-bold text-stone-900">
                Your Profile is Ready!
              </h1>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Welcome to 2nd Chance, <strong>{formData.fullName || 'Member'}</strong>! Complete your National ID verification to build total trust with potential matches.
              </p>
            </div>

            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-xs text-stone-700 text-left space-y-1.5">
              <p className="font-bold text-rose-800 uppercase tracking-wider">What happens next?</p>
              <p>• Your profile is now live for browsing by verified members.</p>
              <p>• You can browse matches and receive interest notifications.</p>
              <p>• Upgrade to Premium anytime to express direct interest.</p>
            </div>

            <div className="pt-2">
              <Button
                variant="wine"
                size="lg"
                onClick={() => router.push('/member')}
                className="w-full justify-center shadow-lg shadow-rose-900/20"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Go to My Member Dashboard
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
                    options={[...MARITAL_STATUS_OPTIONS]}
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

            {/* Step 8: Photos */}
            {currentStep === 8 && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Step 8: Photos & Privacy Settings
                </h2>
                <div className="border-2 border-dashed border-rose-200 rounded-3xl p-8 text-center space-y-3 bg-rose-50/30">
                  <Upload className="w-10 h-10 text-rose-400 mx-auto" />
                  <p className="font-semibold text-stone-900 text-sm">
                    Upload Profile Picture (Mock Uploader)
                  </p>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    JPEG, PNG images up to 5MB. High quality professional portraits get higher match responses.
                  </p>
                  <Button variant="outline" size="sm" type="button">
                    Browse File
                  </Button>
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

            {/* Step 9: Review & Submit */}
            {currentStep === 9 && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Step 9: Review Your Profile Before Publishing
                </h2>

                <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700">
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="font-bold text-stone-900">Full Name:</span>
                    <span>{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="font-bold text-stone-900">Marital Status:</span>
                    <span>{formData.maritalStatus} ({formData.religion})</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="font-bold text-stone-900">Profession & Education:</span>
                    <span>{formData.profession} ({formData.education})</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-200 pb-2">
                    <span className="font-bold text-stone-900">Location:</span>
                    <span>{formData.city}, {formData.country}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block mb-1">About Me:</span>
                    <p className="italic bg-white p-2 rounded border border-stone-200">
                      "{formData.bio}"
                    </p>
                  </div>
                </div>
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
                className="shadow-md shadow-rose-900/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentStep === 9 ? 'Create My Profile' : 'Next Step'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

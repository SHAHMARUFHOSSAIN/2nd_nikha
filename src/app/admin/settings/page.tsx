'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Settings, Save, Shield, CreditCard, Bell, Lock, Globe, CheckCircle2, Image as ImageIcon, Sparkles, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { ImageUploader } from '@/components/ui/image-uploader';
import { OFFICIAL_2ND_CHANCE_LOGO } from '@/lib/official-logo-data';

export default function AdminSettingsPage() {
  const { settings, updateSettings, batchUpdateSettings } = useAdmin();

  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'countries' | 'membership' | 'payment' | 'notifications' | 'security' | 'privacy'>('general');
  const [siteName, setSiteName] = useState(settings.general?.siteName || '2nd Chance Matrimonial');
  const [supportEmail, setSupportEmail] = useState(settings.general?.supportEmail || 'support@2ndchance.com');
  const [gateway, setGateway] = useState(settings.payment?.activeGateway || 'MOCK');
  const [currency, setCurrency] = useState(settings.payment?.currency || 'BDT');

  // Hero CMS Fields
  const initialLogo = settings.branding?.logoUrl || OFFICIAL_2ND_CHANCE_LOGO;

  const [logoUrl, setLogoUrl] = useState(initialLogo);
  const [faviconUrl, setFaviconUrl] = useState(settings.branding?.faviconUrl || '/favicon.ico');
  const [heroTitle, setHeroTitle] = useState(settings.branding?.heroTitle || 'Every heart deserves a second Nikha');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.branding?.heroSubtitle || 'Designed specifically for divorced, widowed, single parents, and mature singles in Bangladesh & global NRB expats.');
  const [heroImageUrl, setHeroImageUrl] = useState(settings.branding?.heroImageUrl || '');

  // Dynamic Country CMS CRUD State
  const defaultCountries = [
    { id: 'c-1', name: 'Bangladesh', flag: '🇧🇩', value: 'Bangladesh', desc: 'Primary Market (All Divisions & Cities)', status: 'ACTIVE' },
    { id: 'c-2', name: 'India', flag: '🇮🇳', value: 'India', desc: 'Enabled (Mumbai, Delhi, Kolkata, Chennai)', status: 'ACTIVE' },
    { id: 'c-3', name: 'Pakistan', flag: '🇵🇰', value: 'Pakistan', desc: 'Enabled (Lahore, Karachi, Islamabad)', status: 'ACTIVE' },
    { id: 'c-4', name: 'United States', flag: '🇺🇸', value: 'United States', desc: 'NRB Expat (Green Card / Citizen)', status: 'ACTIVE' },
    { id: 'c-5', name: 'United Kingdom', flag: '🇬🇧', value: 'United Kingdom', desc: 'NRB Expat (British Citizen)', status: 'ACTIVE' },
    { id: 'c-6', name: 'United Arab Emirates', flag: '🇦🇪', value: 'UAE', desc: 'Dubai / UAE Expat', status: 'ACTIVE' },
    { id: 'c-7', name: 'Saudi Arabia', flag: '🇸🇦', value: 'Saudi Arabia', desc: 'GCC Expat', status: 'ACTIVE' },
    { id: 'c-8', name: 'Canada', flag: '🇨🇦', value: 'Canada', desc: 'NRB Expat', status: 'ACTIVE' },
    { id: 'c-9', name: 'Malaysia', flag: '🇲🇾', value: 'Malaysia', desc: 'South East Asia Expat', status: 'ACTIVE' },
  ];

  const [countryList, setCountryList] = useState<any[]>(settings.countries || defaultCountries);
  const [newCountryName, setNewCountryName] = useState('');
  const [newCountryFlag, setNewCountryFlag] = useState('🌐');
  const [newCountryDesc, setNewCountryDesc] = useState('');
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const isDirty = useRef(false);

  // Sync state when settings hydrate from DB/localStorage as long as user hasn't modified form inputs
  useEffect(() => {
    if (!isDirty.current && settings) {
      if (settings.branding) {
        if (settings.branding.logoUrl) setLogoUrl(settings.branding.logoUrl);
        if (settings.branding.faviconUrl) setFaviconUrl(settings.branding.faviconUrl);
        if (settings.branding.heroTitle) setHeroTitle(settings.branding.heroTitle);
        if (settings.branding.heroSubtitle) setHeroSubtitle(settings.branding.heroSubtitle);
        if (settings.branding.heroImageUrl !== undefined) setHeroImageUrl(settings.branding.heroImageUrl);
      }
      if (settings.general) {
        if (settings.general.siteName) setSiteName(settings.general.siteName);
        if (settings.general.supportEmail) setSupportEmail(settings.general.supportEmail);
      }
      if (settings.payment) {
        if (settings.payment.activeGateway) setGateway(settings.payment.activeGateway);
        if (settings.payment.currency) setCurrency(settings.payment.currency);
      }
      if (settings.countries && Array.isArray(settings.countries) && settings.countries.length > 0) {
        setCountryList(settings.countries);
      }
    }
  }, [settings]);

  const handleLogoChange = (val: string) => {
    isDirty.current = true;
    setLogoUrl(val);
  };

  const handleHeroImageChange = (val: string) => {
    isDirty.current = true;
    setHeroImageUrl(val);
  };

  const handleFaviconChange = (val: string) => {
    isDirty.current = true;
    setFaviconUrl(val);
  };

  const handleAddCountry = () => {
    if (!newCountryName.trim()) return;
    const newCountry = {
      id: `c-${Date.now()}`,
      name: newCountryName.trim(),
      flag: newCountryFlag.trim() || '🌐',
      value: newCountryName.trim(),
      desc: newCountryDesc.trim() || 'Supported Region / Expat Community',
      status: 'ACTIVE',
    };
    const updated = [newCountry, ...countryList];
    setCountryList(updated);
    batchUpdateSettings({ countries: updated });
    setNewCountryName('');
    setNewCountryFlag('🌐');
    setNewCountryDesc('');
    setIsAddingCountry(false);
    setNotice(`Country "${newCountry.name}" added and saved to MySQL Database successfully.`);
  };

  const handleToggleCountryStatus = (id: string) => {
    const updated = countryList.map((c) =>
      c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : c
    );
    setCountryList(updated);
    batchUpdateSettings({ countries: updated });
    setNotice('Country active status updated.');
  };

  const handleDeleteCountry = (id: string, name: string) => {
    const updated = countryList.filter((c) => c.id !== id);
    setCountryList(updated);
    batchUpdateSettings({ countries: updated });
    setNotice(`Country "${name}" deleted from database.`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    batchUpdateSettings({
      general: { siteName, supportEmail },
      payment: { activeGateway: gateway, currency },
      branding: { logoUrl, faviconUrl, heroTitle, heroSubtitle, heroImageUrl },
      countries: countryList,
    });
    isDirty.current = false;
    setNotice(`Hero 1st Image (Logo), Hero 2nd Image, Favicon, Hero Text, and platform settings saved successfully.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-400" />
            <span>Platform Settings & Hero CMS Images</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage Hero 1st 3D Emblem Logo, Hero 2nd Banner Image, Favicon, gateway settings, and security policies.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notice}</span>
          </span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
        {[
          { key: 'general', label: 'General' },
          { key: 'branding', label: 'Hero 1st & Hero 2nd Images' },
          { key: 'countries', label: 'Supported Countries CMS' },
          { key: 'membership', label: 'Membership' },
          { key: 'payment', label: 'Payment & Gateway' },
          { key: 'notifications', label: 'Notifications' },
          { key: 'security', label: 'Security' },
          { key: 'privacy', label: 'Privacy & Data' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-purple-900 text-white border border-purple-700 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSaveSettings} className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-6 shadow-xl max-w-3xl">
        
        {activeTab === 'general' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-white">General Platform Settings</h3>
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Platform Name:</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Support Email Address:</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              />
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="space-y-6 text-xs">
            <h3 className="font-serif font-bold text-base text-white flex items-center gap-2 border-b border-stone-800 pb-3">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              <span>Hero Section 1st & 2nd Image CMS Management</span>
            </h3>

            {/* Hero 1st Image */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="font-serif font-bold text-sm text-purple-300">
                  1. Hero 1st Image (Main 3D Emblem Logo)
                </h4>
                <span className="px-2 py-0.5 bg-purple-950 text-purple-200 rounded-full font-mono text-[10px]">
                  Displayed above headline
                </span>
              </div>

              <ImageUploader
                label="Hero 1st Image File (Upload from Computer / Phone)"
                helperText="Upload PNG, WEBP, or JPG 3D Logo file for the Hero 1st Image slot."
                value={logoUrl}
                onChange={handleLogoChange}
              />
            </div>

            {/* Hero 2nd Image */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="font-serif font-bold text-sm text-purple-300">
                  2. Hero 2nd Image (Couple Portrait Banner Image)
                </h4>
                <span className="px-2 py-0.5 bg-purple-950 text-purple-200 rounded-full font-mono text-[10px]">
                  Displayed in center card
                </span>
              </div>

              <ImageUploader
                label="Hero 2nd Image File (Upload from Computer / Phone)"
                helperText="Upload high-res couple portrait photo for the Hero 2nd Image slot."
                value={heroImageUrl}
                onChange={handleHeroImageChange}
              />
            </div>

            {/* Browser Favicon & Headline Texts */}
            <div className="space-y-4 pt-3 border-t border-stone-800">
              <ImageUploader
                label="3. Browser Favicon Icon (Local File Upload)"
                helperText="Upload tab icon file."
                value={faviconUrl}
                onChange={handleFaviconChange}
              />

              <div className="space-y-1">
                <label className="font-bold text-stone-300">Hero Headline Text:</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => { isDirty.current = true; setHeroTitle(e.target.value); }}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">Hero Subtitle Text:</label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => { isDirty.current = true; setHeroSubtitle(e.target.value); }}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'countries' && (
          <div className="space-y-5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span>Dynamic Supported Countries Management (CRUD)</span>
                </h3>
                <p className="text-stone-400 text-xs mt-0.5">
                  Add, edit, toggle, or remove supported countries enabled across registration, AI match, and global filters.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingCountry(!isAddingCountry)}
                className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold flex items-center gap-1.5 transition-all text-xs self-start"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingCountry ? 'Cancel' : 'Add New Country'}</span>
              </button>
            </div>

            {/* Add Country Form */}
            {isAddingCountry && (
              <div className="p-4 bg-stone-950 rounded-2xl border border-purple-800/80 space-y-3 animate-in fade-in">
                <h4 className="font-bold text-purple-300">Add New Supported Country</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1">Country Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Qatar"
                      value={newCountryName}
                      onChange={(e) => setNewCountryName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1">Flag Emoji:</label>
                    <input
                      type="text"
                      placeholder="e.g. 🇶🇦"
                      value={newCountryFlag}
                      onChange={(e) => setNewCountryFlag(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-400 font-bold block mb-1">Region / Note:</label>
                    <input
                      type="text"
                      placeholder="e.g. GCC Expat"
                      value={newCountryDesc}
                      onChange={(e) => setNewCountryDesc(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddCountry}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Country to Database</span>
                </button>
              </div>
            )}

            {/* Countries CRUD Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {countryList.map((c) => (
                <div key={c.id} className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{c.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 block mt-0.5">{c.desc}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleCountryStatus(c.id)}
                      className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                          : 'bg-stone-800 text-stone-400 border-stone-700 hover:bg-stone-700'
                      }`}
                      title={c.status === 'ACTIVE' ? 'Deactivate Country' : 'Activate Country'}
                    >
                      {c.status === 'ACTIVE' ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-stone-500" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCountry(c.id, c.name)}
                      className="p-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 transition-all"
                      title="Delete Country"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-white">Payment & Gateway Settings</h3>
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Active Payment Gateway:</label>
              <select
                value={gateway}
                onChange={(e) => setGateway(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              >
                <option value="MOCK">Mock Payment Gateway (Development/Testing)</option>
                <option value="SSLCOMMERZ">SSLCommerz (Production - Sandbox / Live)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Default Currency:</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              />
            </div>
          </div>
        )}

        {(activeTab === 'membership' || activeTab === 'notifications' || activeTab === 'security' || activeTab === 'privacy') && (
          <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800 text-xs text-stone-400">
            Configuration preferences for {activeTab} section saved under default platform rules.
          </div>
        )}

        <button
          type="submit"
          className="px-6 py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Hero CMS Settings</span>
        </button>

      </form>
    </div>
  );
}

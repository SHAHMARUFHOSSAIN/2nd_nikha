'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/lib/admin-context';
import {
  Database,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  RefreshCw,
  Sparkles,
  Users,
  UserCheck,
  Crown,
  ShieldAlert,
  FileText,
  HelpCircle,
  Newspaper,
  Image as ImageIcon,
  UserCog,
  Save,
} from 'lucide-react';

export default function SinglePageCrudMasterPage() {
  const {
    members,
    addMember,
    updateMember,
    deleteMember,
    verificationQueue,
    approveVerification,
    rejectVerification,
    deleteVerification,
    membershipPlans,
    addMembershipPlan,
    updateMembershipPlanPrice,
    deleteMembershipPlan,
    moderationReports,
    addModerationReport,
    resolveReport,
    deleteReport,
    cmsPages,
    saveCmsPage,
    deleteCmsPage,
    cmsFaqs,
    saveCmsFaq,
    deleteCmsFaq,
    cmsArticles,
    saveCmsArticle,
    deleteCmsArticle,
    cmsBanners,
    saveCmsBanner,
    deleteCmsBanner,
    adminUsers,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
  } = useAdmin();

  const [activeModel, setActiveModel] = useState<
    'members' | 'verifications' | 'plans' | 'reports' | 'pages' | 'faqs' | 'articles' | 'banners' | 'admins'
  >('members');

  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Create Form Inputs
  const [createTitle, setCreateTitle] = useState('');
  const [createSubtitle, setCreateSubtitle] = useState('');
  const [createExtra, setCreateExtra] = useState('');
  const [createPrice, setCreatePrice] = useState(1499);

  // Edit Form Inputs
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editExtra, setEditExtra] = useState('');
  const [editPrice, setEditPrice] = useState(1499);

  const resetInputs = () => {
    setCreateTitle('');
    setCreateSubtitle('');
    setCreateExtra('');
    setCreatePrice(1499);
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingId(null);
  };

  // Open Edit Modal for an item
  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    if (activeModel === 'members') {
      setEditTitle(item.fullName || '');
      setEditSubtitle(item.profession || '');
      setEditExtra(item.location || '');
    } else if (activeModel === 'plans') {
      setEditTitle(item.name || '');
      setEditSubtitle(item.billingPeriod || '');
      setEditPrice(item.price || 1499);
    } else if (activeModel === 'faqs') {
      setEditTitle(item.question || '');
      setEditSubtitle(item.answer || '');
      setEditExtra(item.category || '');
    } else if (activeModel === 'articles') {
      setEditTitle(item.title || '');
      setEditSubtitle(item.content || '');
      setEditExtra(item.category || '');
    } else if (activeModel === 'admins') {
      setEditTitle(item.name || '');
      setEditSubtitle(item.email || '');
      setEditExtra(item.role || '');
    } else if (activeModel === 'verifications') {
      setEditTitle(item.profile?.fullName || '');
      setEditSubtitle(item.nidNumber || '');
    } else if (activeModel === 'pages') {
      setEditTitle(item.title || '');
      setEditSubtitle(item.content || '');
      setEditExtra(item.seoTitle || '');
    }
    setShowEditModal(true);
  };

  // Create Form Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    if (activeModel === 'members') {
      addMember({
        fullName: createTitle,
        age: 30,
        gender: 'Female',
        maritalStatus: 'Divorced',
        hasChildren: true,
        height: "5'4\"",
        religion: 'Islam',
        education: 'BSc Computer Science',
        profession: createSubtitle || 'Software Engineer',
        location: createExtra || 'Dhaka, Bangladesh',
        city: 'Dhaka',
        country: 'Bangladesh',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        photoPrivacy: 'PUBLIC',
        isVerified: true,
        matchPercentage: 94,
        matchReasons: ['Shared Marital Background'],
        bio: 'Created via Single-Page Master CRUD Control Panel.',
        partnerPreferences: {
          ageRange: '30-40',
          maritalStatuses: ['Divorced'],
          religion: 'Islam',
          minHeight: "5'6\"",
          education: 'Bachelor Degree',
          location: 'Dhaka',
        },
        trustScore: 90,
        membershipTier: 'Premium',
      });
      setNotice(`Member "${createTitle}" created successfully.`);
    } else if (activeModel === 'faqs') {
      saveCmsFaq({
        id: `faq-${Date.now()}`,
        question: createTitle,
        answer: createSubtitle || 'Sample answer text created from single page CRUD manager.',
        category: createExtra || 'General',
        sortOrder: cmsFaqs.length + 1,
        status: 'PUBLISHED',
      });
      setNotice(`FAQ "${createTitle}" created successfully.`);
    } else if (activeModel === 'plans') {
      addMembershipPlan({
        name: createTitle,
        price: Number(createPrice),
        currency: 'BDT',
        billingPeriod: createSubtitle || '1 Month',
        features: ['Full Express Interest Access', 'WhatsApp Contact Unlock'],
        status: 'ACTIVE',
        subscriberCount: 0,
      });
      setNotice(`Membership Plan "${createTitle}" created successfully.`);
    } else if (activeModel === 'admins') {
      addAdminUser({
        name: createTitle,
        email: createSubtitle || `${createTitle.toLowerCase().replace(/\s+/g, '')}@2ndchance.com`,
        role: (createExtra as any) || 'MODERATOR',
        permissions: ['members.view', 'moderation.view'],
        status: 'ACTIVE',
      });
      setNotice(`Admin User "${createTitle}" created successfully.`);
    } else if (activeModel === 'articles') {
      saveCmsArticle({
        id: `art-${Date.now()}`,
        title: createTitle,
        slug: createTitle.toLowerCase().replace(/\s+/g, '-'),
        content: createSubtitle || 'Full article content created from single page CRUD console.',
        excerpt: createExtra || 'Article summary excerpt.',
        category: 'Relationship Advice',
        tags: ['Remarriage', 'Matrimony'],
        featuredImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
        seoTitle: createTitle,
        seoDescription: createSubtitle,
        isFeatured: true,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString().split('T')[0],
      });
      setNotice(`Article "${createTitle}" created successfully.`);
    }

    resetInputs();
  };

  // Edit Form Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editTitle.trim()) return;

    if (activeModel === 'members') {
      updateMember(editingId, {
        fullName: editTitle,
        profession: editSubtitle,
        location: editExtra,
      });
      setNotice(`Member profile updated successfully.`);
    } else if (activeModel === 'plans') {
      updateMembershipPlanPrice(editingId, editPrice);
      setNotice(`Membership plan updated successfully.`);
    } else if (activeModel === 'faqs') {
      const existing = cmsFaqs.find((f) => f.id === editingId);
      if (existing) {
        saveCmsFaq({
          ...existing,
          question: editTitle,
          answer: editSubtitle,
          category: editExtra || existing.category,
        });
      }
      setNotice(`FAQ item updated successfully.`);
    } else if (activeModel === 'articles') {
      const existing = cmsArticles.find((a) => a.id === editingId);
      if (existing) {
        saveCmsArticle({
          ...existing,
          title: editTitle,
          content: editSubtitle,
          category: editExtra || existing.category,
        });
      }
      setNotice(`Article updated successfully.`);
    } else if (activeModel === 'admins') {
      updateAdminUser(editingId, {
        name: editTitle,
        email: editSubtitle,
        role: editExtra as any,
      });
      setNotice(`Admin User updated successfully.`);
    } else if (activeModel === 'pages') {
      const existing = cmsPages.find((p) => p.id === editingId);
      if (existing) {
        saveCmsPage({
          ...existing,
          title: editTitle,
          content: editSubtitle,
          seoTitle: editExtra || existing.seoTitle,
        });
      }
      setNotice(`CMS Page updated successfully.`);
    }

    resetInputs();
  };

  // Delete Handler
  const handleDeleteItem = (id: string, name: string) => {
    if (activeModel === 'members') deleteMember(id);
    else if (activeModel === 'verifications') deleteVerification(id);
    else if (activeModel === 'plans') deleteMembershipPlan(id);
    else if (activeModel === 'reports') deleteReport(id);
    else if (activeModel === 'pages') deleteCmsPage(id);
    else if (activeModel === 'faqs') deleteCmsFaq(id);
    else if (activeModel === 'articles') deleteCmsArticle(id);
    else if (activeModel === 'banners') deleteCmsBanner(id);
    else if (activeModel === 'admins') deleteAdminUser(id);

    setNotice(`Record "${name}" deleted successfully.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-purple-400" />
            <span>Master Single-Page CRUD Control Panel</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Perform Create (➕), Read (👁️), Update (✏️), and Delete (🗑️) operations for all models on the same page.
          </p>
        </div>

        <button
          onClick={() => {
            resetInputs();
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-800 to-rose-900 hover:from-purple-700 hover:to-rose-800 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New {activeModel.toUpperCase()} Record</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Model Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
        {[
          { key: 'members', label: `👥 Members (${members.length})` },
          { key: 'verifications', label: `🆔 Verifications (${verificationQueue.length})` },
          { key: 'plans', label: `👑 Plans (${membershipPlans.length})` },
          { key: 'reports', label: `🛡️ Reports (${moderationReports.length})` },
          { key: 'pages', label: `📝 Pages (${cmsPages.length})` },
          { key: 'faqs', label: `❓ FAQs (${cmsFaqs.length})` },
          { key: 'articles', label: `📰 Articles (${cmsArticles.length})` },
          { key: 'banners', label: `🖼️ Banners (${cmsBanners.length})` },
          { key: 'admins', label: `👨‍💼 Admins (${adminUsers.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveModel(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeModel === tab.key
                ? 'bg-purple-900 text-white border border-purple-700 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="bg-stone-900 p-4 rounded-3xl border border-stone-800 flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={`Search ${activeModel}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
          />
        </div>
      </div>

      {/* Unified Interactive Data Table with Edit & Delete Controls */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="p-4">Record ID</th>
                <th className="p-4">Primary Attribute</th>
                <th className="p-4">Secondary Attribute</th>
                <th className="p-4">Status / Role</th>
                <th className="p-4 text-right">CRUD Operations (Edit & Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              
              {/* MEMBERS MODEL */}
              {activeModel === 'members' &&
                members
                  .filter((m) => m.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((m) => (
                    <tr key={m.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="p-4 font-mono text-purple-400 font-bold">{m.id}</td>
                      <td className="p-4 font-serif font-bold text-white text-sm">{m.fullName}</td>
                      <td className="p-4 text-stone-400">{m.profession} • {m.location}</td>
                      <td className="p-4 font-bold text-emerald-400">{m.membershipTier}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="p-2 bg-purple-950 text-purple-200 border border-purple-800 rounded-xl hover:bg-purple-900 transition-all flex items-center gap-1 text-[11px] font-bold"
                            title="Edit Member"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(m.id, m.fullName)}
                            className="p-2 bg-red-950 text-red-300 border border-red-800 rounded-xl hover:bg-red-900 transition-all"
                            title="Delete Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

              {/* VERIFICATIONS MODEL */}
              {activeModel === 'verifications' &&
                verificationQueue
                  .filter((v) => v.profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((v) => (
                    <tr key={v.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="p-4 font-mono text-purple-400 font-bold">{v.id}</td>
                      <td className="p-4 font-serif font-bold text-white text-sm">{v.profile.fullName}</td>
                      <td className="p-4 font-mono text-stone-400">NID: {v.nidNumber}</td>
                      <td className="p-4 font-bold text-amber-400">{v.status}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(v)}
                            className="p-2 bg-purple-950 text-purple-200 border border-purple-800 rounded-xl hover:bg-purple-900 transition-all flex items-center gap-1 text-[11px] font-bold"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(v.id, v.profile.fullName)}
                            className="p-2 bg-red-950 text-red-300 border border-red-800 rounded-xl hover:bg-red-900 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

              {/* MEMBERSHIP PLANS MODEL */}
              {activeModel === 'plans' &&
                membershipPlans
                  .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="p-4 font-mono text-purple-400 font-bold">{p.id}</td>
                      <td className="p-4 font-serif font-bold text-white text-sm">{p.name}</td>
                      <td className="p-4 font-mono font-bold text-emerald-400">৳{p.price} BDT</td>
                      <td className="p-4 font-bold text-amber-400">{p.status}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 bg-purple-950 text-purple-200 border border-purple-800 rounded-xl hover:bg-purple-900 transition-all flex items-center gap-1 text-[11px] font-bold"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Price</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(p.id, p.name)}
                            className="p-2 bg-red-950 text-red-300 border border-red-800 rounded-xl hover:bg-red-900 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

              {/* CMS FAQS MODEL */}
              {activeModel === 'faqs' &&
                cmsFaqs
                  .filter((f) => f.question.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((f) => (
                    <tr key={f.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="p-4 font-mono text-purple-400 font-bold">{f.id}</td>
                      <td className="p-4 font-serif font-bold text-white text-sm">{f.question}</td>
                      <td className="p-4 text-stone-400 font-mono">{f.category}</td>
                      <td className="p-4 font-bold text-emerald-400">{f.status}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(f)}
                            className="p-2 bg-purple-950 text-purple-200 border border-purple-800 rounded-xl hover:bg-purple-900 transition-all flex items-center gap-1 text-[11px] font-bold"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(f.id, f.question)}
                            className="p-2 bg-red-950 text-red-300 border border-red-800 rounded-xl hover:bg-red-900 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

              {/* ARTICLES MODEL */}
              {activeModel === 'articles' &&
                cmsArticles
                  .filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((a) => (
                    <tr key={a.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="p-4 font-mono text-purple-400 font-bold">{a.id}</td>
                      <td className="p-4 font-serif font-bold text-white text-sm">{a.title}</td>
                      <td className="p-4 text-stone-400 font-mono">{a.category}</td>
                      <td className="p-4 font-bold text-emerald-400">{a.status}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(a)}
                            className="p-2 bg-purple-950 text-purple-200 border border-purple-800 rounded-xl hover:bg-purple-900 transition-all flex items-center gap-1 text-[11px] font-bold"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(a.id, a.title)}
                            className="p-2 bg-red-950 text-red-300 border border-red-800 rounded-xl hover:bg-red-900 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

              {/* ADMIN USERS MODEL */}
              {activeModel === 'admins' &&
                adminUsers
                  .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="p-4 font-mono text-purple-400 font-bold">{u.id}</td>
                      <td className="p-4 font-serif font-bold text-white text-sm">{u.name}</td>
                      <td className="p-4 font-mono text-stone-400">{u.email}</td>
                      <td className="p-4 font-bold text-purple-300">{u.role}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-2 bg-purple-950 text-purple-200 border border-purple-800 rounded-xl hover:bg-purple-900 transition-all flex items-center gap-1 text-[11px] font-bold"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(u.id, u.name)}
                            className="p-2 bg-red-950 text-red-300 border border-red-800 rounded-xl hover:bg-red-900 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-white">Create New {activeModel.toUpperCase()} Record</h3>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-300">Title / Name:</label>
              <input
                type="text"
                placeholder="Enter title or name..."
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-300">Subtitle / Details / Email:</label>
              <input
                type="text"
                placeholder="Enter subtitle or email..."
                value={createSubtitle}
                onChange={(e) => setCreateSubtitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              />
            </div>

            {activeModel === 'plans' && (
              <div className="space-y-1 text-xs">
                <label className="font-bold text-stone-300">Price (BDT):</label>
                <input
                  type="number"
                  value={createPrice}
                  onChange={(e) => setCreatePrice(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-xs font-bold text-stone-400 hover:text-white">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!createTitle.trim()}
                className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                Create Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleEditSubmit} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-white">Edit {activeModel.toUpperCase()} Record</h3>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-300">Title / Name:</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-300">Subtitle / Answer / Email:</label>
              <textarea
                rows={3}
                value={editSubtitle}
                onChange={(e) => setEditSubtitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              />
            </div>

            {activeModel === 'plans' && (
              <div className="space-y-1 text-xs">
                <label className="font-bold text-stone-300">Price (BDT):</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-xs font-bold text-stone-400 hover:text-white">
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Edit Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { HelpCircle, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { CmsFaq } from '@/types/admin';

export default function AdminFaqCmsPage() {
  const { cmsFaqs, saveCmsFaq, deleteCmsFaq } = useAdmin();
  
  const [editingFaq, setEditingFaq] = useState<CmsFaq | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [notice, setNotice] = useState<string | null>(null);

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    const newFaq: CmsFaq = {
      id: `faq-${Date.now()}`,
      question,
      answer,
      category,
      sortOrder: cmsFaqs.length + 1,
      status: 'PUBLISHED',
    };

    saveCmsFaq(newFaq);
    setNotice('New FAQ added successfully.');
    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-purple-400" />
            <span>FAQ Management</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Add, edit, delete, and group frequently asked questions.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Add Form */}
        <div className="lg:col-span-5 bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4 shadow-xl">
          <h3 className="font-serif font-bold text-lg text-white">Add New FAQ</h3>
          <form onSubmit={handleAddFaq} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Category:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-2.5 text-xs text-stone-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Question:</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question text..."
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-2.5 text-xs text-stone-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Answer:</label>
              <textarea
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Detailed answer..."
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              />
            </div>
            <button
              type="submit"
              disabled={!question.trim() || !answer.trim()}
              className="w-full py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-md disabled:opacity-50"
            >
              Add FAQ Item
            </button>
          </form>
        </div>

        {/* FAQ List */}
        <div className="lg:col-span-7 space-y-3">
          {cmsFaqs.map((faq) => (
            <div key={faq.id} className="bg-stone-900 p-5 rounded-3xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                  {faq.category}
                </span>
                <button
                  onClick={() => {
                    deleteCmsFaq(faq.id);
                    setNotice('FAQ item deleted.');
                  }}
                  className="text-red-400 hover:text-red-300 text-xs font-bold"
                >
                  Delete
                </button>
              </div>
              <h4 className="font-serif font-bold text-white text-sm">{faq.question}</h4>
              <p className="text-xs text-stone-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

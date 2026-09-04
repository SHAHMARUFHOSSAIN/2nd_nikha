'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/lib/admin-context';
import { CmsArticle } from '@/types/admin';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/ui/image-uploader';
import { Newspaper, Plus, Edit, Trash2, CheckCircle2, Sparkles, Image as ImageIcon, X } from 'lucide-react';

export default function AdminArticlesCmsPage() {
  const { cmsArticles, saveCmsArticle, deleteCmsArticle } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CmsArticle | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Marriage Advice');
  const [featuredImage, setFeaturedImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Editorial Team');

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setCategory('Marriage Advice');
    setFeaturedImage('https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800');
    setExcerpt('');
    setContent('');
    setAuthor('Editorial Team');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article: CmsArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setCategory(article.category);
    setFeaturedImage(article.featuredImage || '');
    setExcerpt(article.excerpt || '');
    setContent(article.content || '');
    setAuthor(article.author || 'Editorial Team');
    setIsModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !excerpt.trim()) {
      alert('Please provide an article title and summary excerpt.');
      return;
    }

    const articleToSave: CmsArticle = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: excerpt.trim(),
      content: content.trim() || excerpt.trim(),
      featuredImage: featuredImage.trim() || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
      category: category.trim(),
      author: author.trim() || 'Editorial Team',
      status: 'PUBLISHED',
      tags: editingArticle?.tags || ['Matrimonial', category.trim()],
      seoTitle: editingArticle?.seoTitle || title.trim(),
      seoDescription: editingArticle?.seoDescription || excerpt.trim(),
      isFeatured: editingArticle?.isFeatured ?? false,
      publishedAt: editingArticle?.publishedAt || new Date().toISOString().split('T')[0],
      createdAt: editingArticle ? editingArticle.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    saveCmsArticle(articleToSave);
    setIsModalOpen(false);
    setNotice(`Article "${title}" ${editingArticle ? 'updated' : 'created & published'} successfully.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-purple-400" />
            <span>Blog & Matrimonial Articles CMS</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Publish matrimonial advice, single parenting guides, and second marriage articles.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 border border-purple-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Article</span>
        </button>
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

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cmsArticles.map((article) => (
          <div key={article.id} className="bg-stone-900 rounded-3xl p-5 border border-stone-800 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
                <Image src={article.featuredImage} alt={article.title} fill className="object-cover" unoptimized />
              </div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  {article.category}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">{article.createdAt}</span>
              </div>
              <h3 className="font-serif font-bold text-white text-base leading-snug line-clamp-2">{article.title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">{article.excerpt}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
              <button
                onClick={() => handleOpenEditModal(article)}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Edit className="w-3.5 h-3.5 text-purple-400" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete article "${article.title}"?`)) {
                    deleteCmsArticle(article.id);
                    setNotice(`Article "${article.title}" deleted.`);
                  }
                }}
                className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Article Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
        <div className="space-y-5 text-stone-900">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-purple-700" />
              <span>{editingArticle ? 'Edit Matrimonial Article' : 'Create New Matrimonial Article'}</span>
            </h3>
          </div>

          <form onSubmit={handleSaveArticle} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-stone-700 uppercase tracking-wider text-[10px]">Article Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Building Trust After Divorce: A Guide for Bangladeshi Singles"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-stone-700 uppercase tracking-wider text-[10px]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-purple-600"
                >
                  <option value="Marriage Advice">Marriage Advice</option>
                  <option value="Expat NRB Guide">Expat NRB Guide</option>
                  <option value="Single Parenting">Single Parenting</option>
                  <option value="Second Chance Story">Second Chance Story</option>
                  <option value="Islamic Matrimony">Islamic Matrimony</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-stone-700 uppercase tracking-wider text-[10px]">Author Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Editorial Team"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <ImageUploader
              label="Article Cover Image (Upload File from Device)"
              helperText="Upload cover image from computer or phone."
              value={featuredImage}
              onChange={setFeaturedImage}
            />

            <div className="space-y-1">
              <label className="text-stone-700 uppercase tracking-wider text-[10px]">Summary Excerpt *</label>
              <textarea
                required
                rows={2}
                placeholder="Short 2-line preview summary of the article..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-700 uppercase tracking-wider text-[10px]">Full Article Content</label>
              <textarea
                rows={5}
                placeholder="Detailed article paragraph content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border-stone-300 text-stone-700"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="wine"
                size="sm"
                className="rounded-xl shadow-md"
                leftIcon={<Sparkles className="w-4 h-4 fill-white" />}
              >
                {editingArticle ? 'Update Article' : 'Save & Publish Article'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
}

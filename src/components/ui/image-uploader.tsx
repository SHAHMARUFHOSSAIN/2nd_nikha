'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, ImageIcon, X, Check } from 'lucide-react';

export interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'tile';
}

export function ImageUploader({
  value,
  onChange,
  label = 'Upload Image from Device',
  helperText = 'Supports JPG, PNG, WEBP files up to 10MB.',
  className = '',
  variant = 'default',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const rawDataUrl = event.target.result as string;

        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const maxDimension = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const isPng = file.type === 'image/png' || rawDataUrl.startsWith('data:image/png');
            const compressedDataUrl = isPng
              ? canvas.toDataURL('image/png')
              : canvas.toDataURL('image/jpeg', 0.82);
            onChange(compressedDataUrl);
          } else {
            onChange(rawDataUrl);
          }
        };

        img.onerror = () => {
          onChange(rawDataUrl);
        };

        img.src = rawDataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  if (variant === 'compact' || variant === 'tile') {
    return (
      <div className={`relative ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {value ? (
          <div className="relative group w-full h-32 sm:h-36 rounded-2xl overflow-hidden border-2 border-rose-200 shadow-sm bg-stone-900">
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
            
            <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-white text-stone-900 font-bold text-xs shadow-lg hover:scale-110 transition-transform"
                title="Change Photo"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 rounded-full bg-rose-600 text-white font-bold text-xs shadow-lg hover:scale-110 transition-transform"
                title="Remove Photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                {label || 'Photo'}
              </span>
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-32 sm:h-36 border-2 border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
              dragActive
                ? 'border-pink-500 bg-pink-100/60 text-pink-900 scale-[1.02]'
                : 'border-rose-200 bg-rose-50/40 hover:bg-rose-100/60 text-stone-600 hover:border-pink-400 shadow-xs'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 leading-tight">
                {label || '+ Add Photo'}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">Click or drag image</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">{label}</label>}

      {/* Upload Zone & Preview Box */}
      <div className="space-y-3">
        {value ? (
          <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 p-2 flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-700">
              <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Image Loaded Successfully</span>
              </span>
              <p className="text-[10px] text-stone-400 truncate mt-0.5 font-mono">
                {value.startsWith('data:') ? 'Optimized Local Image' : value}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-[11px] font-bold border border-purple-700 transition-all"
              >
                Change File
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 transition-all"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              dragActive
                ? 'border-purple-500 bg-purple-950/40 text-purple-200 scale-[1.01]'
                : 'border-stone-800 bg-stone-950/60 hover:bg-stone-900 text-stone-400 hover:border-purple-500/60'
            }`}
          >
            <div className="p-3 rounded-full bg-purple-950/80 text-purple-400 border border-purple-800">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-200">
                Click to browse files or drag & drop image here
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">{helperText}</p>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

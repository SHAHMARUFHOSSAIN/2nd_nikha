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
}

export function ImageUploader({
  value,
  onChange,
  label = 'Upload Image from Device',
  helperText = 'Supports JPG, PNG, WEBP files up to 10MB.',
  className = '',
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

        // If file is under 500KB, use raw data URL directly to ensure 100% exact original file quality & transparency
        if (file.size < 500 * 1024) {
          onChange(rawDataUrl);
          return;
        }

        // For large files (>500KB), resize via Canvas while preserving PNG transparency
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const maxDimension = 900;
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
              : canvas.toDataURL('image/webp', 0.8);
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

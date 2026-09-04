'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Reset scroll position to absolute top when opened
      if (overlayRef.current) {
        overlayRef.current.scrollTop = 0;
      }
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-3xl',
    '3xl': 'max-w-4xl',
    '4xl': 'max-w-5xl',
  };

  const modalContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto p-2 sm:p-4 lg:p-6 bg-stone-950/70 backdrop-blur-sm transition-opacity animate-in fade-in"
    >
      {/* Backdrop Backdrop Overlay Click */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card Container */}
      <div
        ref={contentRef}
        className={cn(
          'relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100 my-2 sm:my-6 z-10 transition-all transform animate-in zoom-in-95',
          widthClasses[maxWidth]
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-pink-50/50 sticky top-0 z-40">
            <h3 className="text-lg font-serif font-bold text-stone-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 text-stone-800 hover:text-white bg-white/90 hover:bg-pink-600 backdrop-blur-md rounded-full transition-all shadow-lg border border-stone-200 hover:border-pink-500"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}

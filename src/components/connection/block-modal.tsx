'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Ban, AlertTriangle } from 'lucide-react';
import { useConnection } from '@/lib/connection-context';

export interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
  onSuccess?: () => void;
}

export function BlockModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  onSuccess,
}: BlockModalProps) {
  const { blockUser } = useConnection();

  const handleBlockConfirm = () => {
    blockUser(targetUserId);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center space-y-4 py-2">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <Ban className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Block {targetUserName.split(' ')[0]}?
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            You will no longer receive interests, profile visits, or messages from {targetUserName}. This profile will be hidden from your search results.
          </p>
        </div>

        <div className="pt-3 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleBlockConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Block Member
          </Button>
        </div>
      </div>
    </Modal>
  );
}

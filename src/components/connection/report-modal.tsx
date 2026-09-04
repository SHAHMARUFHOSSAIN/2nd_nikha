'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useConnection } from '@/lib/connection-context';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
}

export function ReportModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
}: ReportModalProps) {
  const { reportUser } = useConnection();
  const [reason, setReason] = useState('Inappropriate behavior');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportUser(targetUserId, reason, details);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-50 text-red-600 border border-red-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Report Member
            </h3>
            <p className="text-xs text-stone-500">
              Submitting a report for {targetUserName}
            </p>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Select Reason for Reporting"
              options={[
                'Inappropriate behavior',
                'Fake profile / Misleading details',
                'Spam / Commercial advertising',
                'Harassment or disrespectful communication',
                'Suspicious activity or fraud',
                'Sharing private contact details inappropriately',
                'Other',
              ]}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                Additional Description (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Provide specific details to help our trust team review this..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
              <Button variant="outline" size="sm" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="wine" size="sm" type="submit">
                Submit Report
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-3 py-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-stone-900">
              Report Received
            </h4>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              Thank you for keeping 2nd Chance safe. Our trust & safety team will review this report within 24 hours.
            </p>
            <Button variant="outline" size="sm" onClick={handleClose} className="mt-2">
              Close Window
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

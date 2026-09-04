import { PaymentStatus, PaymentPurpose } from '@/types';

export interface PaymentRequest {
  userId: string;
  recipientId?: string;
  planId?: string;
  purpose: PaymentPurpose;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentInitResult {
  success: boolean;
  gateway: string;
  redirectUrl: string;
  transactionId: string;
  status: PaymentStatus;
}

export interface PaymentVerificationResult {
  verified: boolean;
  status: PaymentStatus;
  transactionId: string;
  amount: number;
  paidAt: string;
}

export interface PaymentResult {
  success: boolean;
  status: PaymentStatus;
  transactionId: string;
}

export interface PaymentGateway {
  initiatePayment(request: PaymentRequest): Promise<PaymentInitResult>;
  verifyPayment(transactionId: string): Promise<PaymentVerificationResult>;
  cancelPayment(transactionId: string): Promise<PaymentResult>;
}

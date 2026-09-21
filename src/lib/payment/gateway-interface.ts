export type PaymentPurpose = 'subscription' | 'interest' | 'verification' | 'boost';

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
  customerCountry?: string;
  customerCity?: string;
  customerState?: string;
  customerAddress?: string;
  customerPostcode?: string;
  /** Mandatory, server-authoritative: must be exactly `true` for the server to
   *  initiate the payment. The server records the authoritative consent
   *  timestamp + IP itself; this flag only clears the server gate. */
  acceptedTerms?: boolean;
}

export interface PaymentInitResult {
  success: boolean;
  gateway: string;
  redirectUrl: string;
  transactionId: string;
  status: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  status: string;
  transactionId: string;
  amount: number;
  currency?: string;
  paidAt: string;
}

export interface PaymentResult {
  success: boolean;
  status: string;
  transactionId: string;
}

export interface PaymentGateway {
  initiatePayment(request: PaymentRequest): Promise<PaymentInitResult>;
  verifyPayment(transactionId: string): Promise<PaymentVerificationResult>;
  cancelPayment(transactionId: string): Promise<PaymentResult>;
}
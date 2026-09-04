import {
  PaymentGateway,
  PaymentRequest,
  PaymentInitResult,
  PaymentVerificationResult,
  PaymentResult,
} from './gateway-interface';
import { PaymentTransaction, PaymentStatus } from '@/types';

const STORAGE_KEY = '2ndchance_mock_transactions';

// In-memory store with localStorage fallback for page refresh persistence
let mockTransactionsStore: Record<string, PaymentTransaction> = {};

function loadStore(): Record<string, PaymentTransaction> {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Fallback
    }
  }
  return mockTransactionsStore;
}

function saveStore(store: Record<string, PaymentTransaction>) {
  mockTransactionsStore = store;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      // Fallback
    }
  }
}

export class MockPaymentGateway implements PaymentGateway {
  async initiatePayment(request: PaymentRequest): Promise<PaymentInitResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const txnId = `TXN-MOCK-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const transaction: PaymentTransaction = {
      id: `pay-txn-${Date.now()}`,
      transactionId: txnId,
      userId: request.userId,
      recipientId: request.recipientId,
      purpose: request.purpose,
      amount: request.amount,
      currency: request.currency,
      status: 'PENDING',
      gateway: 'MockPaymentGateway',
      createdAt: now,
      updatedAt: now,
      metadata: {
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        customerPhone: request.customerPhone,
      },
    };

    const store = loadStore();
    store[txnId] = transaction;
    saveStore(store);

    return {
      success: true,
      gateway: 'MockPaymentGateway',
      redirectUrl: `/member/payment/mock/${txnId}`,
      transactionId: txnId,
      status: 'PENDING',
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const store = loadStore();
    const txn = store[transactionId];

    if (!txn) {
      return {
        verified: false,
        status: 'FAILED',
        transactionId,
        amount: 0,
        paidAt: '-',
      };
    }

    return {
      verified: txn.status === 'SUCCESS' || txn.status === 'PAID',
      status: txn.status,
      transactionId: txn.transactionId,
      amount: txn.amount,
      paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  async cancelPayment(transactionId: string): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const store = loadStore();
    if (store[transactionId]) {
      store[transactionId].status = 'CANCELLED';
      store[transactionId].updatedAt = new Date().toISOString();
      saveStore(store);
    }

    return {
      success: true,
      status: 'CANCELLED',
      transactionId,
    };
  }

  public updateTransactionStatus(transactionId: string, status: PaymentStatus): PaymentTransaction | null {
    const store = loadStore();
    if (store[transactionId]) {
      store[transactionId].status = status;
      store[transactionId].updatedAt = new Date().toISOString();
      saveStore(store);
      return store[transactionId];
    }
    return null;
  }

  public getTransaction(transactionId: string): PaymentTransaction | undefined {
    const store = loadStore();
    return store[transactionId];
  }
}

export const mockGatewayInstance = new MockPaymentGateway();

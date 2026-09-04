import { Subscription, Payment } from '@/types';
import { MEMBERSHIP_CONFIG } from '@/lib/constants';

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1001',
    userId: 'p-101', // Anika Rahman
    planId: 'premium_monthly',
    status: 'ACTIVE',
    amount: MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT,
    currency: 'BDT',
    startedAt: 'Feb 01, 2026',
    expiresAt: 'Mar 01, 2026',
    transactionId: 'TXN-SSL-884920',
    paymentMethod: 'SSLCommerz (bKash Mobile Wallet)',
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-5001',
    userId: 'p-101',
    subscriptionId: 'sub-1001',
    transactionId: 'TXN-SSL-884920',
    amount: MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT,
    currency: 'BDT',
    gateway: 'SSLCommerz',
    status: 'PAID',
    paidAt: 'Feb 01, 2026 14:32',
    createdAt: 'Feb 01, 2026 14:30',
  },
  {
    id: 'pay-5002',
    userId: 'p-101',
    subscriptionId: 'sub-1000',
    transactionId: 'TXN-SSL-773819',
    amount: MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT,
    currency: 'BDT',
    gateway: 'SSLCommerz',
    status: 'PAID',
    paidAt: 'Jan 01, 2026 10:15',
    createdAt: 'Jan 01, 2026 10:12',
  },
  {
    id: 'pay-5003',
    userId: 'p-101',
    subscriptionId: 'sub-999',
    transactionId: 'TXN-SSL-661204',
    amount: MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT,
    currency: 'BDT',
    gateway: 'SSLCommerz',
    status: 'FAILED',
    paidAt: '-',
    createdAt: 'Dec 28, 2025 18:40',
  },
  {
    id: 'pay-5004',
    userId: 'p-101',
    subscriptionId: 'sub-998',
    transactionId: 'TXN-SSL-550193',
    amount: MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT,
    currency: 'BDT',
    gateway: 'SSLCommerz',
    status: 'CANCELLED',
    paidAt: '-',
    createdAt: 'Nov 15, 2025 11:20',
  },
];

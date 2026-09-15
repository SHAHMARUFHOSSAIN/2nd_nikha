import { db } from '@/lib/db';
import { effectiveExpiry, getPlanDurationDays } from '@/lib/subscription';
import { PaymentPurpose } from '@/lib/payment/gateway-interface';

export interface PersistPaymentParams {
  userId?: string;
  planId?: string;
  purpose: PaymentPurpose;
  amount: number;
  currency: string;
  gateway: string;
  transactionId: string;
  valId?: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELLED';
  paidAt?: string;
  email?: string | null;
}

/**
 * Persists a verified payment and applies the benefit (subscription expiry).
 * Uses an upsert on a unique transactionId so IPN + success callbacks are idempotent.
 */
export async function persistSuccessfulPayment(params: PersistPaymentParams) {
  const {
    userId,
    planId,
    purpose,
    amount,
    currency,
    gateway,
    transactionId,
    valId,
    status,
    paidAt,
    email,
  } = params;

  if (!userId) {
    console.warn(`[Payment] No userId for transaction ${transactionId}; payment not persisted.`);
    return null;
  }

  try {
    const existing = await db.payment.findUnique({ where: { transactionId } });
    if (existing) {
      return existing;
    }

    const payment = await db.payment.create({
      data: {
        userId,
        planId: planId ?? (purpose === 'subscription' ? 'monthly' : null),
        purpose,
        amount,
        currency: currency || 'BDT',
        gateway,
        transactionId,
        valId,
        status,
        paidAt: paidAt ? new Date(paidAt) : new Date(),
        email: email ?? null,
      },
    });

    if (purpose === 'subscription' && status === 'SUCCESS') {
      const days = getPlanDurationDays(planId || 'monthly');
      const profile = await db.profile.findUnique({ where: { userId } });

      const newExpiry = effectiveExpiry(
        profile?.subscriptionExpiresAt ? new Date(profile.subscriptionExpiresAt) : null,
        days
      );

      await db.profile.update({
        where: { userId },
        data: {
          subscriptionExpiresAt: newExpiry,
          isSubscriptionActive: true,
          subscriptionPlan: planId || 'monthly',
        },
      });

      await db.user.update({
        where: { id: userId },
        data: { userRole: 'PREMIUM' },
      });
    }

    return payment;
  } catch (error) {
    console.error('[Payment] persistSuccessfulPayment failed:', error);
    return null;
  }
}
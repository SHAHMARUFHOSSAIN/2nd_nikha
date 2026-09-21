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
  consentIp?: string | null;
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
    consentIp,
  } = params;

  if (!userId && !email) {
    console.warn(`[Payment] No userId/email for transaction ${transactionId}; payment not persisted.`);
    return null;
  }

  try {
    const existing = await db.payment.findUnique({ where: { transactionId } });
    if (existing) {
      return existing;
    }

    const payment = await db.payment.create({
      data: {
        userId: userId ?? null,
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
        termsAcceptedAt: new Date(),
        consentIp: consentIp ?? null,
      },
    });

    if (purpose === 'subscription' && status === 'SUCCESS' && userId) {
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

/**
 * Claim pre-registration payments by email for a newly created user account.
 * Only payments with no userId (guest checkout) are linked, then the
 * subscription benefit is applied from the most recent successful payment.
 */
export async function claimPaymentsByEmail(email: string, userId: string) {
  const emailLower = (email || '').toLowerCase();
  if (!emailLower || !userId) return null;

  const payments = await db.payment.findMany({
    where: { email: emailLower, userId: null },
    orderBy: { createdAt: 'asc' },
  });

  if (payments.length === 0) return null;

  await db.payment.updateMany({
    where: { email: emailLower, userId: null },
    data: { userId },
  });

  const latest = payments[payments.length - 1];
  if (latest.status === 'SUCCESS') {
    const days = getPlanDurationDays(latest.planId || 'monthly');
    const newExpiry = effectiveExpiry(null, days);

    await db.profile.update({
      where: { userId },
      data: {
        subscriptionExpiresAt: newExpiry,
        isSubscriptionActive: true,
        subscriptionPlan: latest.planId || 'monthly',
      },
    });

    await db.user.update({
      where: { id: userId },
      data: { userRole: 'PREMIUM' },
    });

    await db.subscription.create({
      data: {
        userId,
        planId: latest.planId || 'monthly',
        planName: latest.planId === 'weekly' ? 'Weekly Pass' : 'Monthly Pass',
        amount: latest.amount,
        currency: latest.currency || 'BDT',
        status: 'ACTIVE',
        packageType: latest.planId === 'weekly' ? 'WEEKLY' : 'MONTHLY',
        startsAt: new Date(),
        expiresAt: newExpiry,
        paymentId: latest.id,
        transactionId: latest.transactionId,
      },
    }).catch(() => null);
  }

  return payments;
}
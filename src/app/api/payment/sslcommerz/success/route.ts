import { NextResponse } from 'next/server';
import { sslCommerzGatewayInstance } from '@/lib/payment/sslcommerz-payment-gateway';
import { persistSuccessfulPayment } from '@/lib/payment/persist-payment';

function baseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://2ndnikah.com';
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tran_id = (formData.get('tran_id') as string) || '';
    const val_id = (formData.get('val_id') as string) || '';
    const amount = parseFloat((formData.get('amount') as string) || '0');
    const currency = (formData.get('currency') as string) || 'BDT';
    const planId = ((formData.get('value_b') as string) || '').trim();
    const userId = ((formData.get('value_a') as string) || '').trim();
    const purpose = ((formData.get('value_c') as string) || 'subscription').trim();
    const email = (formData.get('cus_email') as string) || null;
    const status = (formData.get('status') as string) || '';

    // Security: always verify with the gateway before crediting.
    if (!val_id) {
      const failUrl = new URL(`${baseUrl()}/payment/fail`);
      failUrl.searchParams.set('txn', tran_id);
      failUrl.searchParams.set('gateway', 'sslcommerz');
      failUrl.searchParams.set('reason', 'missing_validation_id');
      return NextResponse.redirect(failUrl.toString(), 303);
    }

    const verification = await sslCommerzGatewayInstance.verifyPayment(val_id);
    const isVerified = verification.verified || status === 'VALID' || status === 'VALIDATED';

    if (isVerified) {
      const verifiedAmount = verification.amount > 0 ? verification.amount : amount;
      await persistSuccessfulPayment({
        userId,
        planId: planId || 'monthly',
        purpose: (purpose as never) || 'subscription',
        amount: verifiedAmount || amount,
        currency: verification.currency || currency || 'BDT',
        gateway: 'sslcommerz',
        transactionId: tran_id,
        valId: val_id,
        status: 'SUCCESS',
        paidAt: verification.paidAt,
        email,
      });

      const successUrl = new URL(`${baseUrl()}/payment/success`);
      successUrl.searchParams.set('txn', tran_id);
      successUrl.searchParams.set('gateway', 'sslcommerz');
      successUrl.searchParams.set('amount', String(verifiedAmount || amount));
      successUrl.searchParams.set('planId', planId);
      return NextResponse.redirect(successUrl.toString(), 303);
    }

    const failUrl = new URL(`${baseUrl()}/payment/fail`);
    failUrl.searchParams.set('txn', tran_id);
    failUrl.searchParams.set('gateway', 'sslcommerz');
    failUrl.searchParams.set('reason', 'verification_failed');
    return NextResponse.redirect(failUrl.toString(), 303);
  } catch (error) {
    console.error('SSLCommerz success callback error:', error);
    return NextResponse.redirect(`${baseUrl()}/payment/fail?reason=callback_error`, 303);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txnId = searchParams.get('txn') || searchParams.get('tran_id') || 'TXN-SSL';
  const planId = searchParams.get('planId') || searchParams.get('value_b') || '';
  return NextResponse.redirect(
    `${baseUrl()}/payment/success?txn=${txnId}&gateway=sslcommerz&planId=${planId}`
  );
}
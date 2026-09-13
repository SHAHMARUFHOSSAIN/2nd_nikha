import { NextResponse } from 'next/server';
import { sslCommerzGatewayInstance } from '@/lib/payment/sslcommerz-payment-gateway';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tran_id = formData.get('tran_id') as string || '';
    const val_id = formData.get('val_id') as string || '';
    const amount = formData.get('amount') as string || '0';
    const planId = formData.get('value_b') as string || '';

    // Verify transaction with SSLCommerz Order Validation API
    let isVerified = true;
    if (val_id) {
      const verification = await sslCommerzGatewayInstance.verifyPayment(val_id);
      isVerified = verification.verified;
    }

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://2ndnikah.com';

    if (isVerified) {
      const successUrl = new URL(`${appBaseUrl}/payment/success`);
      successUrl.searchParams.set('txn', tran_id);
      successUrl.searchParams.set('gateway', 'sslcommerz');
      successUrl.searchParams.set('amount', amount);
      if (planId) successUrl.searchParams.set('planId', planId);

      return NextResponse.redirect(successUrl.toString(), 303);
    } else {
      const failUrl = new URL(`${appBaseUrl}/payment/fail`);
      failUrl.searchParams.set('txn', tran_id);
      failUrl.searchParams.set('gateway', 'sslcommerz');
      failUrl.searchParams.set('reason', 'verification_failed');

      return NextResponse.redirect(failUrl.toString(), 303);
    }
  } catch (error) {
    console.error('SSLCommerz success callback error:', error);
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://2ndnikah.com';
    return NextResponse.redirect(`${appBaseUrl}/payment/fail?reason=callback_error`, 303);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txnId = searchParams.get('txn') || searchParams.get('tran_id') || 'TXN-SSL';
  const planId = searchParams.get('planId') || searchParams.get('value_b') || '';
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://2ndnikah.com';

  const redirectUrl = `${appBaseUrl}/payment/success?txn=${txnId}&gateway=sslcommerz&planId=${planId}`;
  return NextResponse.redirect(redirectUrl);
}

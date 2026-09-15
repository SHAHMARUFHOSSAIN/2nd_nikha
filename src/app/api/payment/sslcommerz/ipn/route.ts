import { NextResponse } from 'next/server';
import { sslCommerzGatewayInstance } from '@/lib/payment/sslcommerz-payment-gateway';
import { persistSuccessfulPayment } from '@/lib/payment/persist-payment';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const val_id = (formData.get('val_id') as string) || '';
    const tran_id = (formData.get('tran_id') as string) || '';
    const status = (formData.get('status') as string) || '';
    const amount = parseFloat((formData.get('amount') as string) || '0');
    const currency = (formData.get('currency') as string) || 'BDT';
    const planId = ((formData.get('value_b') as string) || 'monthly').trim();
    const userId = ((formData.get('value_a') as string) || '').trim();
    const purpose = ((formData.get('value_c') as string) || 'subscription').trim();
    const email = (formData.get('cus_email') as string) || null;

    if (!val_id || (status !== 'VALID' && status !== 'VALIDATED')) {
      return NextResponse.json({ status: 'FAILED', message: 'IPN rejected (missing or invalid status)' }, { status: 400 });
    }

    const verification = await sslCommerzGatewayInstance.verifyPayment(val_id);

    if (verification.verified) {
      await persistSuccessfulPayment({
        userId,
        planId,
        purpose: (purpose as never) || 'subscription',
        amount: verification.amount > 0 ? verification.amount : amount,
        currency: verification.currency || currency || 'BDT',
        gateway: 'sslcommerz',
        transactionId: tran_id || verification.transactionId,
        valId: val_id,
        status: 'SUCCESS',
        paidAt: verification.paidAt,
        email,
      });
      return NextResponse.json({ status: 'SUCCESS', message: 'IPN processed successfully' });
    }

    return NextResponse.json({ status: 'FAILED', message: 'IPN verification failed' }, { status: 400 });
  } catch (error: any) {
    console.error('SSLCommerz IPN Error:', error);
    return NextResponse.json({ status: 'ERROR', message: error.message }, { status: 500 });
  }
}
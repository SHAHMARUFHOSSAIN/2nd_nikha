import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sslCommerzGatewayInstance } from '@/lib/payment/sslcommerz-payment-gateway';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const txnId = searchParams.get('txn') || searchParams.get('transactionId') || '';
  const gateway = searchParams.get('gateway') || '';

  if (!txnId) {
    return NextResponse.json({ success: false, verified: false, error: 'Missing transaction id' }, { status: 400 });
  }

  try {
    const payment = await db.payment.findUnique({ where: { transactionId: txnId } });

    if (payment) {
      const verified = payment.status === 'SUCCESS' || payment.status === 'PAID';
      return NextResponse.json({
        success: true,
        verified,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency || 'BDT',
        gateway: payment.gateway || gateway,
        purpose: payment.purpose,
        transactionId: payment.transactionId,
        planId: payment.planId || undefined,
      });
    }

    if (gateway === 'sslcommerz' || gateway.toLowerCase().includes('ssl')) {
      const verification = await sslCommerzGatewayInstance.verifyPayment(txnId);
      return NextResponse.json({
        success: true,
        verified: verification.verified,
        status: verification.status,
        amount: verification.amount,
        currency: verification.currency || 'BDT',
        gateway: 'sslcommerz',
        transactionId: txnId,
      });
    }

    return NextResponse.json({
      success: true,
      verified: false,
      status: 'MISSING',
      amount: 0,
      currency: 'BDT',
      transactionId: txnId,
    });
  } catch (error: any) {
    console.error('GET /api/payment/verify error:', error);
    return NextResponse.json({ success: false, verified: false, error: 'Verification failed' }, { status: 500 });
  }
}
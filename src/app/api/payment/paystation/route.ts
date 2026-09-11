import { NextResponse } from 'next/server';
import { payStationGatewayInstance } from '@/lib/payment/paystation-payment-gateway';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, transactionId, paymentRequest } = body;

    if (action === 'initiate') {
      const result = await payStationGatewayInstance.initiatePayment(paymentRequest);
      return NextResponse.json(result);
    }

    if (action === 'verify') {
      const result = await payStationGatewayInstance.verifyPayment(transactionId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Payment server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txnId = searchParams.get('txn') || 'TXN-PS-DEMO';
  const status = searchParams.get('status') || 'success';

  if (status === 'cancel') {
    return NextResponse.redirect(new URL(`/payment/cancel?txn=${txnId}`, request.url));
  }

  if (status === 'fail') {
    return NextResponse.redirect(new URL(`/payment/fail?txn=${txnId}`, request.url));
  }

  return NextResponse.redirect(new URL(`/payment/success?txn=${txnId}&gateway=paystation`, request.url));
}

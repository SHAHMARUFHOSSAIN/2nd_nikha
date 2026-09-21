import { NextResponse } from 'next/server';
import { sslCommerzGatewayInstance } from '@/lib/payment/sslcommerz-payment-gateway';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentRequest, acceptedTerms } = body;

    if (!paymentRequest || !paymentRequest.amount) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment request parameters' },
        { status: 400 }
      );
    }

    // Server-authoritative payment consent: SSLCommerz subscriptions are
    // legally bound, so the payment session must NOT be created unless the
    // member explicitly consented to Terms, Privacy, and Refund Policy.
    // The browser sends an explicit boolean; the server is the arbiter.
    if (acceptedTerms !== true) {
      return NextResponse.json(
        {
          success: false,
          error: 'You must accept the Terms & Conditions, Privacy Policy, and Refund Policy before proceeding with payment.',
          code: 'CONSENT_REQUIRED',
        },
        { status: 422 }
      );
    }

    const result = await sslCommerzGatewayInstance.initiatePayment(paymentRequest);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('SSLCommerz Init API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}

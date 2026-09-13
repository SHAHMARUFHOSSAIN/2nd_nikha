import { NextResponse } from 'next/server';
import { sslCommerzGatewayInstance } from '@/lib/payment/sslcommerz-payment-gateway';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentRequest } = body;

    if (!paymentRequest || !paymentRequest.amount) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment request parameters' },
        { status: 400 }
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

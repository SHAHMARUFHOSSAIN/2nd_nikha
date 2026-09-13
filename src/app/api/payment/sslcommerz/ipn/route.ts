import { NextResponse } from 'next/server';
import { sslCommerzGatewayInstance } from '@/lib/payment/sslcommerz-payment-gateway';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const val_id = formData.get('val_id') as string || '';
    const tran_id = formData.get('tran_id') as string || '';
    const status = formData.get('status') as string || '';

    if (val_id && (status === 'VALID' || status === 'VALIDATED')) {
      const verification = await sslCommerzGatewayInstance.verifyPayment(val_id);
      if (verification.verified) {
        console.log(`[SSLCommerz IPN Success] Transaction ${tran_id} validated successfully.`);
        return NextResponse.json({ status: 'SUCCESS', message: 'IPN processed successfully' });
      }
    }

    return NextResponse.json({ status: 'FAILED', message: 'IPN verification failed' }, { status: 400 });
  } catch (error: any) {
    console.error('SSLCommerz IPN Error:', error);
    return NextResponse.json({ status: 'ERROR', message: error.message }, { status: 500 });
  }
}

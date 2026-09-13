import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tran_id = formData.get('tran_id') as string || '';
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://2ndnikah.com';

    const cancelUrl = new URL(`${appBaseUrl}/payment/cancel`);
    cancelUrl.searchParams.set('txn', tran_id);
    cancelUrl.searchParams.set('gateway', 'sslcommerz');

    return NextResponse.redirect(cancelUrl.toString(), 303);
  } catch (error) {
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://2ndnikah.com';
    return NextResponse.redirect(`${appBaseUrl}/payment/cancel?gateway=sslcommerz`, 303);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txnId = searchParams.get('txn') || searchParams.get('tran_id') || '';
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://2ndnikah.com';

  return NextResponse.redirect(`${appBaseUrl}/payment/cancel?txn=${txnId}&gateway=sslcommerz`);
}

import { PaymentGateway, PaymentRequest, PaymentInitResult, PaymentVerificationResult, PaymentResult } from './gateway-interface';

export interface SSLCommerzConfig {
  storeId?: string;
  storePassword?: string;
  isLive?: boolean;
}

export class SSLCommerzPaymentGateway implements PaymentGateway {
  private config: SSLCommerzConfig;

  constructor(config: SSLCommerzConfig = {}) {
    this.config = config;
  }

  getStoreId(): string {
    return this.config.storeId || process.env.NEXT_PUBLIC_SSLCOMMERZ_STORE_ID || process.env.SSLCOMMERZ_STORE_ID || 'ndnikah0live';
  }

  getStorePassword(): string {
    return this.config.storePassword || process.env.SSLCOMMERZ_STORE_PASSWORD || '6AA67B2A4DD6B64213';
  }

  isLiveMode(): boolean {
    if (this.config.isLive !== undefined) return this.config.isLive;
    const envLive = process.env.NEXT_PUBLIC_SSLCOMMERZ_IS_LIVE || process.env.SSLCOMMERZ_IS_LIVE;
    return envLive === 'true' || envLive === undefined || envLive === '1';
  }

  getApiBaseUrl(): string {
    return this.isLiveMode()
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentInitResult> {
    const transactionId = `TXN-SSL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://2ndnikah.com';

    // If running in client browser, proxy initiation through backend Next.js API route to avoid CORS
    if (typeof window !== 'undefined') {
      try {
        const apiRes = await fetch('/api/payment/sslcommerz/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentRequest: request }),
        });
        if (apiRes.ok) {
          const result = await apiRes.json();
          if (result && result.redirectUrl) {
            return result;
          }
        }
      } catch (err) {
        console.warn('Client API initiation fallback:', err);
      }
    }

    const storeId = this.getStoreId();
    const storePassword = this.getStorePassword();

    try {
      const initUrl = `${this.getApiBaseUrl()}/gwprocess/v4/api.php`;
      const formData = new URLSearchParams();

      // Convert non-BDT amounts to BDT equivalent for SSLCommerz merchant processing
      let chargeAmount = Math.round(request.amount);
      if (request.currency === 'USD' && request.amount < 50) {
        chargeAmount = Math.round(request.amount * 120);
      } else if (request.currency === 'INR' && request.amount < 100) {
        chargeAmount = Math.round(request.amount * 1.4);
      } else if (request.currency === 'PKR' && request.amount < 500) {
        chargeAmount = Math.round(request.amount * 0.43);
      }

      formData.append('store_id', storeId);
      formData.append('store_passwd', storePassword);
      formData.append('total_amount', chargeAmount.toString());
      formData.append('currency', 'BDT');
      formData.append('tran_id', transactionId);
      formData.append('success_url', `${appUrl}/api/payment/sslcommerz/success`);
      formData.append('fail_url', `${appUrl}/api/payment/sslcommerz/fail`);
      formData.append('cancel_url', `${appUrl}/api/payment/sslcommerz/cancel`);
      formData.append('ipn_url', `${appUrl}/api/payment/sslcommerz/ipn`);
      formData.append('cus_name', request.customerName || '2nd Nikah User');
      formData.append('cus_email', request.customerEmail || 'user@2ndnikah.com');
      formData.append('cus_add1', 'Gulshan 2');
      formData.append('cus_add2', 'Dhaka');
      formData.append('cus_city', 'Dhaka');
      formData.append('cus_state', 'Dhaka');
      formData.append('cus_postcode', '1212');
      formData.append('cus_country', 'Bangladesh');
      formData.append('cus_phone', request.customerPhone || '01712345678');
      formData.append('cus_fax', request.customerPhone || '01712345678');
      formData.append('shipping_method', 'NO');
      formData.append('product_name', request.planId ? `Subscription Plan (${request.planId})` : 'Matrimonial Service');
      formData.append('product_category', 'Services');
      formData.append('product_profile', 'non-physical-goods');
      formData.append('value_a', request.userId || '');
      formData.append('value_b', request.planId || '');
      formData.append('value_c', request.purpose || 'subscription');

      const response = await fetch(initUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('SSLCommerz Session API Response:', data);
        if (data.status === 'SUCCESS' && data.GatewayPageURL) {
          return {
            success: true,
            gateway: 'sslcommerz',
            redirectUrl: data.GatewayPageURL,
            transactionId,
            status: 'PENDING',
          };
        } else {
          console.error('SSLCommerz Session Init Failed Reason:', data.failedreason || data);
        }
      }
    } catch (err) {
      console.error('SSLCommerz payment init exception:', err);
    }

    // On failure or error, redirect to payment fail page so user knows payment was not completed
    return {
      success: false,
      gateway: 'sslcommerz',
      redirectUrl: `/payment/fail?gateway=sslcommerz&reason=gateway_init_error`,
      transactionId,
      status: 'FAILED',
    };
  }

  async verifyPayment(val_id: string): Promise<PaymentVerificationResult> {
    const storeId = this.getStoreId();
    const storePassword = this.getStorePassword();

    if (storeId && storePassword && val_id) {
      try {
        const validateUrl = `${this.getApiBaseUrl()}/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${storeId}&store_passwd=${storePassword}&v=1&format=json`;
        const response = await fetch(validateUrl);

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'VALID' || data.status === 'VALIDATED') {
            return {
              verified: true,
              status: 'SUCCESS',
              transactionId: data.tran_id,
              amount: parseFloat(data.amount || '0'),
              paidAt: data.tran_date || new Date().toISOString(),
            };
          }
        }
      } catch (error) {
        console.error('SSLCommerz validation error:', error);
      }
    }

    return {
      verified: false,
      status: 'FAILED',
      transactionId: `TXN-SSL-FAIL-${Date.now()}`,
      amount: 0,
      paidAt: new Date().toISOString(),
    };
  }

  async cancelPayment(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      status: 'CANCELLED',
      transactionId,
    };
  }
}

export const sslCommerzGatewayInstance = new SSLCommerzPaymentGateway();

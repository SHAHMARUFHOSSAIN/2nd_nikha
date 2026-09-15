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
    return this.config.storeId || process.env.NEXT_PUBLIC_SSLCOMMERZ_STORE_ID || '';
  }

  getStorePassword(): string {
    return this.config.storePassword || process.env.SSLCOMMERZ_STORE_PASSWORD || '';
  }

  isLiveMode(): boolean {
    if (this.config.isLive !== undefined) return this.config.isLive;
    const envLive = process.env.NEXT_PUBLIC_SSLCOMMERZ_IS_LIVE;
    return envLive === 'true' || envLive === '1';
  }

  getApiBaseUrl(): string {
    return this.isLiveMode()
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentInitResult> {
    const transactionId = `TXN-SSL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://2ndnikah.com';

    const storeId = this.getStoreId();
    const storePassword = this.getStorePassword();

    if (!storeId || !storePassword) {
      console.error('SSLCommerz not configured: missing store_id/store_passwd (set SSLCOMMERZ_STORE_PASSWORD server-side).');
      return {
        success: false,
        gateway: 'sslcommerz',
        redirectUrl: `/payment/fail?gateway=sslcommerz&reason=${encodeURIComponent('gateway_not_configured')}`,
        transactionId,
        status: 'FAILED',
      };
    }

    try {
      const initUrl = `${this.getApiBaseUrl()}/gwprocess/v4/api.php`;
      const formData = new URLSearchParams();

      const targetCurrency = (request.currency || 'BDT').toUpperCase();
      const chargeAmount = request.amount;
      const customerCountry = request.customerCountry || 'Bangladesh';

      formData.append('store_id', storeId);
      formData.append('store_passwd', storePassword);
      formData.append('total_amount', chargeAmount.toFixed(2));
      formData.append('currency', targetCurrency);
      formData.append('tran_id', transactionId);
      formData.append('success_url', `${appUrl}/api/payment/sslcommerz/success`);
      formData.append('fail_url', `${appUrl}/api/payment/sslcommerz/fail`);
      formData.append('cancel_url', `${appUrl}/api/payment/sslcommerz/cancel`);
      formData.append('ipn_url', `${appUrl}/api/payment/sslcommerz/ipn`);
      formData.append('cus_name', request.customerName || '2nd Nikah User');
      formData.append('cus_email', request.customerEmail || 'user@2ndnikah.com');
      formData.append('cus_add1', request.customerAddress || 'Gulshan 2');
      formData.append('cus_add2', request.customerCity || 'Dhaka');
      formData.append('cus_city', request.customerCity || 'Dhaka');
      formData.append('cus_state', request.customerState || 'Dhaka');
      formData.append('cus_postcode', request.customerPostcode || '1212');
      formData.append('cus_country', customerCountry);
      formData.append('cus_phone', request.customerPhone || '01712345678');
      formData.append('cus_fax', request.customerPhone || '01712345678');
      formData.append('shipping_method', 'NO');
      formData.append('product_name', request.planId ? `Matrimonial Subscription (${request.planId})` : 'Matrimonial Service');
      formData.append('product_category', 'Service');
      formData.append('product_profile', request.planId === 'monthly' || request.planId === 'annual' || request.planId === 'weekly'
        ? 'general'
        : 'non-physical-goods');
      formData.append('emi_option', '0');
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
          console.error('SSLCommerz Session Init Error:', data.failedreason || data);
          const errReason = `${data.failedreason || data.status || 'init_failed'}`;
          return {
            success: false,
            gateway: 'sslcommerz',
            redirectUrl: `/payment/fail?gateway=sslcommerz&reason=${encodeURIComponent(errReason)}`,
            transactionId,
            status: 'FAILED',
          };
        }
      }
    } catch (err) {
      console.error('SSLCommerz payment init exception:', err);
    }

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

    if (!storeId || !val_id) {
      return {
        verified: false,
        status: 'FAILED',
        transactionId: '',
        amount: 0,
        paidAt: new Date().toISOString(),
      };
    }

    try {
      const validateUrl = `${this.getApiBaseUrl()}/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${storeId}&format=json`;
      const response = await fetch(validateUrl, { cache: 'no-store' });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'VALID' || data.status === 'VALIDATED') {
          return {
            verified: true,
            status: 'SUCCESS',
            transactionId: data.tran_id || val_id,
            amount: parseFloat(data.amount || '0'),
            currency: data.currency || 'BDT',
            paidAt: data.tran_date || new Date().toISOString(),
          };
        }
      }
    } catch (error) {
      console.error('SSLCommerz validation error:', error);
    }

    return {
      verified: false,
      status: 'FAILED',
      transactionId: val_id,
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
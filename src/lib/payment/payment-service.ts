import { getPaymentGateway } from './payment-gateway-factory';
import { sslCommerzGatewayInstance } from './sslcommerz-payment-gateway';
import { PaymentRequest, PaymentInitResult, PaymentVerificationResult } from './gateway-interface';

/**
 * High-level Payment Service
 * Single source of truth for payment operations across 2nd Chance platform.
 * SSLCommerz must be initiated through the server-side API route, because the
 * store password (SSLCOMMERZ_STORE_PASSWORD) is server-only and never bundled
 * into the client. Running it directly in the browser always fails with
 * "gateway_not_configured".
 */
export const PaymentService = {
  async initiatePayment(request: PaymentRequest): Promise<PaymentInitResult> {
    const gateway = getPaymentGateway();

    if (gateway === sslCommerzGatewayInstance) {
      try {
        const res = await fetch('/api/payment/sslcommerz/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ paymentRequest: request }),
        });
        const data = await res.json().catch(() => null);
        if (data && typeof data === 'object') {
          return data as PaymentInitResult;
        }
        return {
          success: false,
          gateway: 'sslcommerz',
          redirectUrl: `/payment/fail?gateway=sslcommerz&reason=${encodeURIComponent('init_failed')}`,
          transactionId: '',
          status: 'FAILED',
        };
      } catch (e: any) {
        return {
          success: false,
          gateway: 'sslcommerz',
          redirectUrl: `/payment/fail?gateway=sslcommerz&reason=${encodeURIComponent(e?.message || 'init_error')}`,
          transactionId: '',
          status: 'FAILED',
        };
      }
    }

    return gateway.initiatePayment(request);
  },

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    const gateway = getPaymentGateway();
    return gateway.verifyPayment(transactionId);
  },

  async cancelPayment(transactionId: string) {
    const gateway = getPaymentGateway();
    return gateway.cancelPayment(transactionId);
  },
};

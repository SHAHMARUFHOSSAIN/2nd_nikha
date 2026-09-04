import { getPaymentGateway } from './payment-gateway-factory';
import { PaymentRequest, PaymentInitResult, PaymentVerificationResult } from './gateway-interface';

/**
 * High-level Payment Service
 * Single source of truth for payment operations across 2nd Chance platform.
 */
export const PaymentService = {
  async initiatePayment(request: PaymentRequest): Promise<PaymentInitResult> {
    const gateway = getPaymentGateway();
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

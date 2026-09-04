import { PaymentGateway } from './gateway-interface';
import { mockGatewayInstance } from './mock-payment-gateway';

/**
 * Payment Gateway Factory
 * Gateway-agnostic factory returning the active payment gateway instance.
 * Default is MockPaymentGateway. Easily replaceable with SSLCommerzPaymentGateway when credentials become available.
 */
export function getPaymentGateway(): PaymentGateway {
  const gatewayType = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || 'mock';

  if (gatewayType === 'sslcommerz') {
    // Future: return new SSLCommerzPaymentGateway();
    return mockGatewayInstance;
  }

  return mockGatewayInstance;
}

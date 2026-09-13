import { PaymentGateway } from './gateway-interface';
import { mockGatewayInstance } from './mock-payment-gateway';
import { payStationGatewayInstance } from './paystation-payment-gateway';
import { sslCommerzGatewayInstance } from './sslcommerz-payment-gateway';

/**
 * Payment Gateway Factory
 * Dynamic gateway factory returning the active payment gateway instance.
 * Supports SSLCommerz, PayStation BD, and Mock Gateway.
 */
export function getPaymentGateway(configuredGateway?: string): PaymentGateway {
  const activeType = (configuredGateway || process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || 'sslcommerz').toLowerCase();

  if (activeType === 'sslcommerz' || activeType === 'ssl') {
    return sslCommerzGatewayInstance;
  }

  if (activeType === 'paystation' || activeType === 'ps') {
    return payStationGatewayInstance;
  }

  return mockGatewayInstance;
}


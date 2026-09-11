import { PaymentGateway } from './gateway-interface';
import { mockGatewayInstance } from './mock-payment-gateway';
import { payStationGatewayInstance } from './paystation-payment-gateway';

/**
 * Payment Gateway Factory
 * Dynamic gateway factory returning the active payment gateway instance.
 * Supports PayStation BD, SSLCommerz, and Mock Gateway.
 */
export function getPaymentGateway(configuredGateway?: string): PaymentGateway {
  const activeType = (configuredGateway || process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || 'paystation').toLowerCase();

  if (activeType === 'paystation' || activeType === 'ps') {
    return payStationGatewayInstance;
  }

  if (activeType === 'sslcommerz') {
    return mockGatewayInstance;
  }

  return payStationGatewayInstance;
}


import { apiClient, ApiResponse } from '@/lib/api-client';

export const PaymentService = {
  async initiateSSLCommerz(membershipPlanId: number = 1, amount?: number): Promise<ApiResponse<{ gateway_url: string; transaction_id: string; amount: number }>> {
    return apiClient.post('/payments/sslcommerz/initiate', {
      membership_plan_id: membershipPlanId,
      amount: amount || 1499.00,
      purpose: 'subscription',
    });
  },
};

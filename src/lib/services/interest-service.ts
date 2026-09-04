import { apiClient, ApiResponse } from '@/lib/api-client';
import { Interest } from '@/types';

export const InterestService = {
  async sendInterest(receiverId: string): Promise<ApiResponse<Interest>> {
    return apiClient.post('/interests', { receiver_id: receiverId });
  },

  async getReceivedInterests(): Promise<ApiResponse<Interest[]>> {
    return apiClient.get('/interests/received');
  },

  async getSentInterests(): Promise<ApiResponse<Interest[]>> {
    return apiClient.get('/interests/sent');
  },

  async acceptInterest(interestId: string): Promise<ApiResponse<{ interest_id: string; match_id: string; conversation_id: string }>> {
    return apiClient.post(`/interests/${interestId}/accept`);
  },

  async rejectInterest(interestId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/interests/${interestId}/reject`);
  },
};

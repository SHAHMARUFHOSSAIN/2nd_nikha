import { apiClient, ApiResponse } from '@/lib/api-client';
import { Profile } from '@/types';

export const ProfileService = {
  async searchProfiles(filters: Record<string, any>): Promise<ApiResponse<Profile[]>> {
    return apiClient.get('/search', filters);
  },

  async getProfileById(id: string): Promise<ApiResponse<Profile>> {
    return apiClient.get(`/profiles/${id}`);
  },

  async updateMyProfile(data: Partial<Profile>): Promise<ApiResponse<Profile>> {
    return apiClient.put('/profiles/me', data);
  },
};

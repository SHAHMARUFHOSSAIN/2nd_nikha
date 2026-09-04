import { apiClient, ApiResponse } from '@/lib/api-client';
import { Conversation, Message } from '@/types';

export const MessageService = {
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return apiClient.get('/conversations');
  },

  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    return apiClient.get(`/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, content: string, type: string = 'TEXT'): Promise<ApiResponse<Message>> {
    return apiClient.post(`/conversations/${conversationId}/messages`, { content, type });
  },

  async shareContact(conversationId: string, details?: { phone?: string; whatsapp?: string; email?: string }): Promise<ApiResponse<any>> {
    return apiClient.post(`/conversations/${conversationId}/contacts`, details);
  },
};

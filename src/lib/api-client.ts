/**
 * 2nd Chance Matrimonial API v1 Client
 * Unified HTTP client interface for backend API communication
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data || {}),
    });

    return this.handleResponse<T>(response);
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data || {}),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const json = await response.json().catch(() => ({
      success: false,
      message: 'Server error or invalid JSON response.',
    }));

    if (!response.ok) {
      return {
        success: false,
        message: json.message || `HTTP Error ${response.status}`,
        errors: json.errors,
        data: json.data || null,
      };
    }

    return json;
  }
}

export const apiClient = new ApiClient();

// src/utils/api.ts
interface ApiResponse<T> {
    data: T;
    error?: string;
  }
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  
  class ApiService {
    private async request<T>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };
  
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred');
        }
  
        return { data };
      } catch (error) {
        return {
          data: {} as T,
          error: error instanceof Error ? error.message : 'An unknown error occurred',
        };
      }
    }
  
    // Authentication Endpoints
    async login(email: string, password: string) {
      return this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    }
  
    async register(userData: any) {
      return this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    }
  
    // Chef Endpoints
    async getChefs(filters?: Record<string, any>) {
      const queryString = filters ? `?${new URLSearchParams(filters)}` : '';
      return this.request(`/chefs${queryString}`);
    }
  
    async getChefById(id: string) {
      return this.request(`/chefs/${id}`);
    }
  
    async updateChefProfile(id: string, profileData: any) {
      return this.request(`/chefs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    }
  
    // Booking Endpoints
    async createBooking(bookingData: any) {
      return this.request('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    }
  
    async getBookings(userId: string, userType: 'chef' | 'customer') {
      return this.request(`/bookings/${userType}/${userId}`);
    }
  
    async updateBookingStatus(bookingId: string, status: string) {
      return this.request(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    }
  }
  
  export const api = new ApiService();
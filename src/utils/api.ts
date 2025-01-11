// src/utils/api.ts
import { Menu } from '../types/menu.types';
import { Booking, BookingFormData } from '../types/booking.types';
import { Chef } from '../types/chef.types';


export interface ApiResponse<T> {
    data: T;
    error?: string;
    message?: string;
}

export interface UserData {
    email: string;
    password: string;
    userType: 'chef' | 'customer';
    profile: {
        firstName: string;
        lastName: string;
        bio?: string;
        specialties?: string[];
        location?: string;
    };
}

export interface ProfileData {
    firstName: string;
    lastName: string;
    bio?: string;
    specialties?: string[];
    location?: string;
    yearsOfExperience?: number;
    certifications?: string[];
    availableForBooking?: boolean;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        userType: 'chef' | 'customer';
    };
}

export interface BookingFilters {
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    startDate?: string;
    endDate?: string;
    chefId?: string;
    customerId?: string;
}

export interface MenuFilters {
    cuisine?: string[];
    priceRange?: {
        min: number;
        max: number;
    };
    dietaryPreferences?: string[];
    status?: 'draft' | 'active' | 'inactive';
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
    async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(userData: UserData): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Chef Endpoints
    async getChefs(filters?: Record<string, any>): Promise<ApiResponse<Chef[]>> {
        const queryString = filters ? `?${new URLSearchParams(filters)}` : '';
        return this.request<Chef[]>(`/chefs${queryString}`);
    }

    async getChefById(id: string): Promise<ApiResponse<Chef>> {
        return this.request<Chef>(`/chefs/${id}`);
    }

    async updateChefProfile(id: string, profileData: ProfileData): Promise<ApiResponse<Chef>> {
        return this.request<Chef>(`/chefs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    // Menu Endpoints
    async createMenu(menuData: Omit<Menu, 'id'>): Promise<ApiResponse<Menu>> {
        return this.request<Menu>('/menus', {
            method: 'POST',
            body: JSON.stringify(menuData),
        });
    }

    async getMenus(filters?: MenuFilters): Promise<ApiResponse<Menu[]>> {
        const queryString = filters ? `?${new URLSearchParams(JSON.stringify(filters))}` : '';
        return this.request<Menu[]>(`/menus${queryString}`);
    }

    async getMenuById(id: string): Promise<ApiResponse<Menu>> {
        return this.request<Menu>(`/menus/${id}`);
    }

    async updateMenu(id: string, menuData: Partial<Menu>): Promise<ApiResponse<Menu>> {
        return this.request<Menu>(`/menus/${id}`, {
            method: 'PUT',
            body: JSON.stringify(menuData),
        });
    }

    async deleteMenu(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/menus/${id}`, {
            method: 'DELETE',
        });
    }

    async getChefMenus(chefId: string): Promise<ApiResponse<Menu[]>> {
      return this.request<Menu[]>(`/chefs/${chefId}/menus`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });
  }

    // Booking Endpoints
    async createBooking(bookingData: BookingFormData): Promise<ApiResponse<Booking>> {
        return this.request<Booking>('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    }

    async getBookings(userId: string, userType: 'chef' | 'customer', filters?: BookingFilters): Promise<ApiResponse<Booking[]>> {
        const queryString = filters ? `?${new URLSearchParams(JSON.stringify(filters))}` : '';
        return this.request<Booking[]>(`/bookings/${userType}/${userId}${queryString}`);
    }

    async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
        return this.request<Booking>(`/bookings/${bookingId}`);
    }

    async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<ApiResponse<Booking>> {
        return this.request<Booking>(`/bookings/${bookingId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    // Availability Endpoints
    async getChefAvailability(chefId: string, startDate: string, endDate: string): Promise<ApiResponse<Array<{ date: string; slots: string[] }>>> {
        return this.request(`/chefs/${chefId}/availability`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate, endDate }),
        });
    }

    async updateChefAvailability(chefId: string, availability: { date: string; slots: string[] }[]): Promise<ApiResponse<void>> {
        return this.request(`/chefs/${chefId}/availability`, {
            method: 'PUT',
            body: JSON.stringify({ availability }),
        });
    }

  // Token Management
  setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    localStorage.removeItem('authToken');
  }
}

export const api = new ApiService();
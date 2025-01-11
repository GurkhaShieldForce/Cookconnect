import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

export const ApiService = {
  async getMenuDetails(menuId: string) {
    return axios.get(`${API_BASE_URL}/api/menus/${menuId}`);
  },
  
  async createBooking(bookingData: any) {
    return axios.post(`${API_BASE_URL}/api/bookings`, bookingData);
  }
};
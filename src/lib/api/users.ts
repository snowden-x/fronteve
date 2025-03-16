import apiClient from './client';
import { User } from '@/lib/types';

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
}

export interface UserUpdateData {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  role?: string;
}

const usersApi = {
  // Get all users with optional filters
  getUsers: async (filters: UserFilters = {}): Promise<UserListResponse> => {
    console.log('Fetching users with filters:', filters);
    const response = await apiClient.get('api/auth/users/', { params: filters });
    return response.data;
  },

  // Get a single user by ID
  getUser: async (id: number): Promise<User> => {
    console.log('Fetching user details for ID:', id);
    const response = await apiClient.get(`api/auth/users/${id}/`);
    return response.data;
  },

  // Get current user details
  getCurrentUser: async (): Promise<User> => {
    console.log('Fetching current user details');
    const response = await apiClient.get('api/auth/users/me/');
    return response.data;
  },

  // Update user information
  updateUser: async (id: number, userData: UserUpdateData): Promise<User> => {
    console.log('Updating user:', id, userData);
    try {
      const response = await apiClient.patch(`api/auth/users/${id}/`, userData);
      return response.data;
    } catch (error: any) {
      console.error('User update error:', error.response?.data);
      throw error;
    }
  },

  // Update current user information
  updateCurrentUser: async (userData: UserUpdateData): Promise<User> => {
    console.log('Updating current user:', userData);
    try {
      const response = await apiClient.patch('api/auth/users/me/', userData);
      return response.data;
    } catch (error: any) {
      console.error('Current user update error:', error.response?.data);
      throw error;
    }
  }
};

export default usersApi; 
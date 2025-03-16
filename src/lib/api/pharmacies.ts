import apiClient from './client';
import { User } from '@/lib/types';

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  is_active: boolean;
  staff: User[];
  created_at: string;
  updated_at: string;
}

export interface PharmacyListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pharmacy[];
}

export interface PharmacyFilters {
  search?: string;
  is_active?: boolean;
  page?: number;
}

export interface PharmacyCreateData {
  name: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  is_active?: boolean;
}

export interface PharmacyUpdateData {
  name?: string;
  address?: string;
  contact_phone?: string;
  contact_email?: string;
  is_active?: boolean;
}

export interface StaffManagementData {
  user_id: number;
}

const pharmaciesApi = {
  // Get all pharmacies with optional filters
  getPharmacies: async (filters: PharmacyFilters = {}): Promise<PharmacyListResponse> => {
    console.log('Fetching pharmacies with filters:', filters);
    const response = await apiClient.get('/api/pharmacies/', { params: filters });
    return response.data;
  },

  // Get a single pharmacy by ID
  getPharmacy: async (id: number): Promise<Pharmacy> => {
    console.log('Fetching pharmacy details for ID:', id);
    const response = await apiClient.get(`/api/pharmacies/${id}/`);
    return response.data;
  },

  // Create a new pharmacy
  createPharmacy: async (pharmacyData: PharmacyCreateData): Promise<Pharmacy> => {
    console.log('Creating new pharmacy:', pharmacyData);
    try {
      const response = await apiClient.post('/api/pharmacies/', pharmacyData);
      return response.data;
    } catch (error: any) {
      console.error('Pharmacy creation error:', error.response?.data);
      throw error;
    }
  },

  // Update pharmacy information
  updatePharmacy: async (id: number, pharmacyData: PharmacyUpdateData): Promise<Pharmacy> => {
    console.log('Updating pharmacy:', id, pharmacyData);
    try {
      const response = await apiClient.patch(`/api/pharmacies/${id}/`, pharmacyData);
      return response.data;
    } catch (error: any) {
      console.error('Pharmacy update error:', error.response?.data);
      throw error;
    }
  },

  // Delete a pharmacy
  deletePharmacy: async (id: number): Promise<void> => {
    console.log('Deleting pharmacy:', id);
    try {
      await apiClient.delete(`/api/pharmacies/${id}/`);
    } catch (error: any) {
      console.error('Pharmacy deletion error:', error.response?.data);
      throw error;
    }
  },

  // Add staff to pharmacy
  addStaffToPharmacy: async (pharmacyId: number, data: StaffManagementData): Promise<Pharmacy> => {
    console.log('Adding staff to pharmacy:', pharmacyId, data);
    try {
      const response = await apiClient.post(`/api/pharmacies/${pharmacyId}/add_staff/`, data);
      return response.data;
    } catch (error: any) {
      console.error('Add staff error:', error.response?.data);
      throw error;
    }
  },

  // Remove staff from pharmacy
  removeStaffFromPharmacy: async (pharmacyId: number, data: StaffManagementData): Promise<Pharmacy> => {
    console.log('Removing staff from pharmacy:', pharmacyId, data);
    try {
      const response = await apiClient.post(`/api/pharmacies/${pharmacyId}/remove_staff/`, data);
      return response.data;
    } catch (error: any) {
      console.error('Remove staff error:', error.response?.data);
      throw error;
    }
  }
};

export default pharmaciesApi; 
import apiClient from './client';

export interface Medicine {
  id: number;
  name: string;
  generic_name: string;
  description: string;
  manufacturer: string;
  approval_date: string | null;
  dosage_form: string;
  strength: string;
  requires_prescription: boolean;
  contraindications: string;
  side_effects: string;
  storage_instructions: string;
  fda_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicineListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Medicine[];
}

export interface MedicineFilters {
  search?: string;
  requires_prescription?: boolean;
  fda_approved?: boolean;
  manufacturer?: string;
  dosage_form?: string;
  page?: number;
}

const medicinesApi = {
  // Get all medicines with optional filters
  getMedicines: async (filters: MedicineFilters = {}): Promise<MedicineListResponse> => {
    const response = await apiClient.get('/api/medicines/', { params: filters });
    return response.data;
  },

  // Get a single medicine by ID
  getMedicine: async (id: number): Promise<Medicine> => {
    const response = await apiClient.get(`/api/medicines/${id}/`);
    return response.data;
  },

  // Create a new medicine
  createMedicine: async (medicine: Partial<Medicine>): Promise<Medicine> => {
    const response = await apiClient.post('/api/medicines/', medicine);
    return response.data;
  },

  // Update an existing medicine
  updateMedicine: async (id: number, medicine: Partial<Medicine>): Promise<Medicine> => {
    const response = await apiClient.put(`/api/medicines/${id}/`, medicine);
    return response.data;
  },

  // Delete a medicine
  deleteMedicine: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/medicines/${id}/`);
  }
};

export default medicinesApi; 
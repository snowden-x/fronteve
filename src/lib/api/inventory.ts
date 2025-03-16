import apiClient from './client';
import { Medicine } from './medicines';

export interface Inventory {
  id: number;
  medicine: number | Medicine;
  unit_price: number;
  cost_price: number;
  quantity: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryWithDetails extends Omit<Inventory, 'medicine'> {
  medicine: Medicine;
}

export interface InventoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: InventoryWithDetails[];
}

export interface InventoryFilters {
  low_stock?: boolean;
  page?: number;
}

export interface StockAdjustment {
  quantity: number;
}

const inventoryApi = {
  // Get all inventory items with optional filters
  getInventory: async (filters: InventoryFilters = {}): Promise<InventoryListResponse> => {
    const response = await apiClient.get('/api/inventory/', { params: filters });
    return response.data;
  },

  // Get items with low stock
  getLowStockItems: async (): Promise<InventoryListResponse> => {
    const response = await apiClient.get('/api/inventory/low_stock/');
    return response.data;
  },

  // Get a single inventory item by ID
  getInventoryItem: async (id: number): Promise<InventoryWithDetails> => {
    const response = await apiClient.get(`/api/inventory/${id}/`);
    return response.data;
  },

  // Create a new inventory item
  createInventoryItem: async (inventory: Partial<Inventory>): Promise<Inventory> => {
    const response = await apiClient.post('/api/inventory/', inventory);
    return response.data;
  },

  // Update an existing inventory item
  updateInventoryItem: async (id: number, inventory: Partial<Inventory>): Promise<Inventory> => {
    const response = await apiClient.put(`/api/inventory/${id}/`, inventory);
    return response.data;
  },

  // Delete an inventory item
  deleteInventoryItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/inventory/${id}/`);
  },

  // Adjust inventory stock level
  adjustStock: async (id: number, adjustment: StockAdjustment): Promise<Inventory> => {
    const response = await apiClient.post(`/api/inventory/${id}/adjust_stock/`, adjustment);
    return response.data;
  }
};

export default inventoryApi; 
import apiClient from './client';

export interface SalesDashboard {
  total_sales: number;
  total_revenue: number;
  average_order_value: number;
  // Add other dashboard metrics as needed
}

export interface SalesByType {
  type: string;
  count: number;
  revenue: number;
}

export interface DailySalesReport {
  date: string;
  total_sales: number;
  total_revenue: number;
}

export interface ProductSalesReport {
  product_id: number;
  product_name: string;
  quantity_sold: number;
  revenue: number;
}

export interface ReportParams {
  start_date?: string;
  end_date?: string;
  pharmacy_id?: number;
}

const reportsApi = {
  // Get sales dashboard data
  getDashboard: async (): Promise<SalesDashboard> => {
    const response = await apiClient.get('/api/sales/dashboard/');
    return response.data;
  },

  // Get sales grouped by type
  getSalesByType: async (params?: ReportParams): Promise<SalesByType> => {
    const response = await apiClient.get('/api/sales/sales_by_type/', { params });
    return response.data;
  },

  // Get daily sales reports
  getDailySalesReports: async (params?: ReportParams): Promise<DailySalesReport[]> => {
    const response = await apiClient.get('/api/daily-sales-reports/', { params });
    return response.data;
  },

  // Get product-wise sales reports
  getProductSalesReports: async (params?: ReportParams): Promise<ProductSalesReport[]> => {
    const response = await apiClient.get('/api/product-sales-reports/', { params });
    return response.data;
  }
};

export default reportsApi; 
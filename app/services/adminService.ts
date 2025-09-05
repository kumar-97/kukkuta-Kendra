import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api';

// Types for Admin Farmer Operations
export interface AdminFarmerCreate {
  email: string;
  full_name: string;
  password: string;
  phone: string;
  address: string;
  farm_type: string;
  experience_years?: number;
  is_verified?: boolean;
}

export interface AdminFarmerUpdate {
  full_name?: string;
  is_active?: boolean;
  phone?: string;
  address?: string;
  farm_type?: string;
  experience_years?: number;
  is_verified?: boolean;
}

export interface FarmerListItem {
  id: number;
  user_id: number;
  phone: string;
  address: string;
  farm_type: string;
  experience_years: number;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  user_email: string;
  user_full_name: string;
  user_is_active: boolean;
  farm_count: number;
}

export interface FarmerSearchResult {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  farm_type: string;
  is_verified: boolean;
}

export interface FarmersCountResponse {
  total_farmers: number;
  verified_farmers: number;
  unverified_farmers: number;
  active_users: number;
  inactive_users: number;
  verification_rate: number;
  farm_type_distribution: Record<string, number>;
}

export interface BulkVerifyResponse {
  message: string;
  updated_count: number;
  farmer_ids: number[];
  is_verified: boolean;
}

// Helper function to get auth headers
async function getAuthHeaders() {
  const token = await SecureStore.getItemAsync('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Admin Farmer API Service
export class AdminFarmerService {
  
  /**
   * Get all farmers with filtering and pagination
   */
  static async getAllFarmers(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    farm_type?: string;
    is_verified?: boolean;
  }): Promise<FarmerListItem[]> {
    try {
      const headers = await getAuthHeaders();
      const queryParams = new URLSearchParams();
      
      if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.farm_type) queryParams.append('farm_type', params.farm_type);
      if (params?.is_verified !== undefined) queryParams.append('is_verified', params.is_verified.toString());
      
      const url = `${API_CONFIG.FARMERS_URL}/?${queryParams.toString()}`;
      const response = await axios.get(url, { headers });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch farmers');
    }
  }

  /**
   * Get farmer by ID
   */
  static async getFarmerById(farmerId: number): Promise<FarmerListItem> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_CONFIG.FARMERS_URL}/${farmerId}`, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch farmer');
    }
  }

  /**
   * Create new farmer with user account
   */
  static async createFarmer(farmerData: AdminFarmerCreate): Promise<FarmerListItem> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_CONFIG.FARMERS_URL}/admin/create`, farmerData, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create farmer');
    }
  }

  /**
   * Update farmer and user data
   */
  static async updateFarmer(farmerId: number, farmerData: AdminFarmerUpdate): Promise<FarmerListItem> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${API_CONFIG.FARMERS_URL}/${farmerId}`, farmerData, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update farmer');
    }
  }

  /**
   * Delete farmer and optionally user account
   */
  static async deleteFarmer(farmerId: number, deleteUserAccount: boolean = false): Promise<{ message: string; farmer_id: number; user_deleted: boolean }> {
    try {
      const headers = await getAuthHeaders();
      const queryParams = deleteUserAccount ? '?delete_user_account=true' : '';
      const response = await axios.delete(`${API_CONFIG.FARMERS_URL}/${farmerId}${queryParams}`, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete farmer');
    }
  }

  /**
   * Get farmers count and statistics
   */
  static async getFarmersCount(): Promise<FarmersCountResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_CONFIG.FARMERS_URL}/admin/count`, { headers });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch farmers statistics');
    }
  }

  /**
   * Bulk verify/unverify farmers
   */
  static async bulkVerifyFarmers(farmerIds: number[], isVerified: boolean = true): Promise<BulkVerifyResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(
        `${API_CONFIG.FARMERS_URL}/admin/bulk-verify?is_verified=${isVerified}`, 
        farmerIds, 
        { headers }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to bulk verify farmers');
    }
  }

  /**
   * Quick search farmers
   */
  static async searchFarmers(query: string, limit: number = 10): Promise<{ query: string; results_count: number; farmers: FarmerSearchResult[] }> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${API_CONFIG.FARMERS_URL}/admin/search?query=${encodeURIComponent(query)}&limit=${limit}`, 
        { headers }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to search farmers');
    }
  }
}

// Export default service instance
export default AdminFarmerService;


import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api';

export interface RoutineData {
  date: string;
  mortality_count?: number;
  feed_consumption_kg: number;
  average_bird_weight_g: number;
  water_consumption_liters?: number;
  temperature_celsius?: number;
  humidity_percentage?: number;
  notes?: string;
}

export interface RoutineResponse {
  id: number;
  farmer_id: number;
  date: string;
  mortality_count: number;
  feed_consumption_kg: number;
  average_bird_weight_g: number;
  water_consumption_liters?: number;
  temperature_celsius?: number;
  humidity_percentage?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface MortalityRecord {
  count: number;
  cause?: string;
  age_days?: number;
  photo_url?: string;
  notes?: string;
}

export async function submitRoutineData(data: RoutineData): Promise<RoutineResponse> {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios.post(`${API_CONFIG.ROUTINE_URL}/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getMyRoutineData(
  start_date?: string,
  end_date?: string
): Promise<RoutineResponse[]> {
  const token = await SecureStore.getItemAsync('access_token');
  const params = new URLSearchParams();
  if (start_date) params.append('start_date', start_date);
  if (end_date) params.append('end_date', end_date);
  
  const response = await axios.get(`${API_CONFIG.ROUTINE_URL}/?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getRoutineDataById(routineId: number): Promise<RoutineResponse> {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios.get(`${API_CONFIG.ROUTINE_URL}/${routineId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateRoutineData(
  routineId: number,
  data: Partial<RoutineData>
): Promise<RoutineResponse> {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios.put(`${API_CONFIG.ROUTINE_URL}/${routineId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function deleteRoutineData(routineId: number): Promise<void> {
  const token = await SecureStore.getItemAsync('access_token');
  await axios.delete(`${API_CONFIG.ROUTINE_URL}/${routineId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function submitMortalityRecord(data: {
  routine_data_id: number;
  count: number;
  cause?: string;
  age_days?: number;
  photo_url?: string;
  notes?: string;
}): Promise<any> {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios.post(`${API_CONFIG.ROUTINE_URL}/mortality`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function uploadMortalityPhoto(imageUri: string): Promise<{ file_url: string }> {
  const token = await SecureStore.getItemAsync('access_token');
  
  // Create form data for file upload
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'mortality_photo.jpg',
  } as any);
  
  const response = await axios.post(`${API_CONFIG.ROUTINE_URL}/upload-photo`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
} 
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api';

export type UserRole = 'farmer' | 'mill' | 'admin' | 'report';

export interface RegisterPayload {
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  role: UserRole;
}

export async function register(payload: RegisterPayload) {
  console.log(payload);
  try {
    const response = await axios.post(`${API_CONFIG.AUTH_URL}/register`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.detail || error;
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${API_CONFIG.AUTH_URL}/login`, payload);
    const data = response.data;
    console.log(data);
    await SecureStore.setItemAsync('access_token', data.access_token);
    await SecureStore.setItemAsync('user_role', data.role);
    await SecureStore.setItemAsync('user_id', String(data.user_id));
    return data;
  } catch (error: any) {
    throw error.response?.data?.detail || error;
  }
}

export async function logout() {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('user_role');
  await SecureStore.deleteItemAsync('user_id');
}

export async function getToken() {
  return SecureStore.getItemAsync('access_token');
} 
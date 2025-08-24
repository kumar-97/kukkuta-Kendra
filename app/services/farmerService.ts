import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api';

export async function getProfile() {
  const token = await SecureStore.getItemAsync('access_token');
  const res = await axios.get(`${API_CONFIG.FARMERS_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateProfile(profileData: any) {
  const token = await SecureStore.getItemAsync('access_token');
  const res = await axios.put(`${API_CONFIG.FARMERS_URL}/me`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
} 
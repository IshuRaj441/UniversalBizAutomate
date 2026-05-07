import api from './axios';

const API_URL = '/auth';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    credits: number;
    is_admin: boolean;
  };
}

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post(`${API_URL}/register`, {
    email,
    password,
  });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async (token: string) => {
  const response = await api.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

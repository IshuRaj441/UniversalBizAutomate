import axios from 'axios';
import appConfig from '../config';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if you need to send cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (axiosConfig) => {
    const token = localStorage.getItem(appConfig.auth.tokenKey);
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(appConfig.auth.tokenKey);
      localStorage.removeItem(appConfig.auth.userKey);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

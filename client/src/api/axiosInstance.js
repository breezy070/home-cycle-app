import axios from '@/api/axiosInstance';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, 
  withCredentials: true,                   // send/receive cookies
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;

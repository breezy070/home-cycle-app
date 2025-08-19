import axios from 'axios';

// Base URL: dev proxy vs prod env var
// use baseURL = "" for localhost testing
// const baseURL = ""
  // import.meta.env.MODE === 'development'
  //   ? '/api'
  //   : import.meta.env.VITE_API_BASE;

// console.log('[axios baseURL]', baseURL);

// const api = axios.create({
//   baseURL,
//   withCredentials: true,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 15000,
// });

export const api = axios.create({
  baseURL: '/api',                // always proxy through Netlify
  withCredentials: true,          // so cookies ride along
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// OPTIONAL: if you need to add Authorization header without importing the store
// Read once per request from localStorage or cookies (no imports!)
// api.interceptors.request.use((config) => {
//   // Example: localStorage (if you store a token there)
//   const token = localStorage.getItem('access_token'); // or your key
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;


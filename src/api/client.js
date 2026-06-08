import axios from 'axios';
const baseFromEnv = import.meta.env.VITE_API_URL || 'http://43.205.113.12:8008';
// Ensure we end with a single '/api' segment. If VITE_API_URL already includes '/api', strip it first.
const baseURL = baseFromEnv.replace(/\/api\/?$/,'').replace(/\/$/, '') + '/api';


const api = axios.create({
  baseURL,
  // Don't set default Content-Type to allow FormData to set multipart/form-data
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 403 && err.response?.data?.errorCode === 'EMAIL_NOT_VERIFIED') {
      if (!window.location.pathname.includes('/verify-email')) {
        window.location.href = '/verify-email';
      }
    }
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect if already on auth pages
      if (!['/', '/login', '/register', '/auth', '/verify-email'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err.response?.data || err);
  }
);

export default api;

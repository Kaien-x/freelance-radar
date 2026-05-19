import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginAPI, registerAPI, getMeAPI } from '../api/auth.api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await loginAPI({ email, password });
          console.log('Login API response:', res);
          // Backend returns: { success: true, message, data: { user, token } }
          // Extract user and token from data property
          const { data } = res || {};
          const { user, token } = data || {};
          if (!token || !user) {
            throw new Error('Invalid response from server');
          }
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true });
          return user;
        } catch (err) {
          console.error('Login store error:', err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await registerAPI(data);
          console.log('Register API response:', res);
          // Backend returns: { success: true, message, data: { user, token } }
          // Extract user and token from data property
          const { data: responseData } = res || {};
          const { user, token } = responseData || {};
          if (!token || !user) {
            throw new Error('Invalid response from server');
          }
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true });
          return user;
        } catch (err) {
          console.error('Register store error:', err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      refreshUser: async () => {
        try {
          const res = await getMeAPI();
          set({ user: res.data });
        } catch {
          get().logout();
        }
      },
    }),
    { name: 'auth', partialize: (s) => ({ token: s.token, user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
)

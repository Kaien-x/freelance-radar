import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { googleAuthAPI, getMeAPI } from '../api/auth.api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Authenticate with Google.
       * @param {string} idToken – the credential string from Google Identity Services
       * @param {string} [role]  – 'jobseeker' | 'jobposter' (used on first sign-up)
       */
      loginWithGoogle: async (idToken, role) => {
        set({ isLoading: true });
        try {
          const res = await googleAuthAPI({ idToken, role });
          const { data } = res || {};
          const { user, token } = data || {};
          if (!token || !user) throw new Error('Invalid response from server');
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true });
          return user;
        } catch (err) {
          console.error('Google login error:', err);
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
    {
      name: 'auth',
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);

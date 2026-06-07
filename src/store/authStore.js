import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { googleAuthAPI, loginAPI, registerAPI, getMeAPI, verifyEmailAPI, resendVerificationAPI } from '../api/auth.api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      /** Authenticate with Google. */
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

      /** Login with email + password. */
      loginWithEmail: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await loginAPI({ email, password });
          const { data } = res || {};
          const { user, token } = data || {};
          if (!token || !user) throw new Error('Invalid response from server');
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true });
          return user;
        } catch (err) {
          console.error('Email login error:', err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      /** Register with email + password. */
      registerWithEmail: async (name, email, password, role) => {
        set({ isLoading: true });
        try {
          const res = await registerAPI({ name, email, password, role });
          const { data } = res || {};
          const { user, token } = data || {};
          if (!token || !user) throw new Error('Invalid response from server');
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true });
          return user;
        } catch (err) {
          console.error('Register error:', err);
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
        } catch (err) {
          if (err?.errorCode !== 'EMAIL_NOT_VERIFIED') {
            get().logout();
          }
        }
      },

      /** Verify email with OTP. */
      verifyEmailOTP: async (otp) => {
        set({ isLoading: true });
        try {
          const res = await verifyEmailAPI({ otp });
          const { data } = res || {};
          const { user, token } = data || {};
          if (!token || !user) throw new Error('Invalid response from server');
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true });
          return user;
        } catch (err) {
          console.error('Verify email error:', err);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      /** Resend verification OTP. */
      resendVerificationOTP: async () => {
        set({ isLoading: true });
        try {
          await resendVerificationAPI();
        } catch (err) {
          console.error('Resend verification error:', err);
          throw err;
        } finally {
          set({ isLoading: false });
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

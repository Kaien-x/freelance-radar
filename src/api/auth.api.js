import api from './client';

// ─── Google OAuth ─────────────────────────────────────────────────────────────
export const googleAuthAPI = (data) => api.post('/auth/google', data);

// ─── Email / Password Auth ───────────────────────────────────────────────────
export const registerAPI    = (data) => api.post('/auth/register', data);
export const loginAPI       = (data) => api.post('/auth/login', data);
export const forgotPasswordAPI  = (data) => api.post('/auth/forgot-password', data);
export const resetPasswordAPI   = (data) => api.post('/auth/reset-password', data);
export const verifyEmailAPI     = (data) => api.post('/auth/verify-email', data);
export const resendVerificationAPI = () => api.post('/auth/resend-verification');

// ─── Profile ──────────────────────────────────────────────────────────────────
export const getMeAPI         = () => api.get('/auth/me');
export const updateProfileAPI = (data) => api.put('/auth/profile', data);
export const updateSkillsAPI  = (skills) => api.put('/auth/skills', { skills });
export const getAllSkills     = () => api.get('/auth/skills');
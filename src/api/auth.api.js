import api from './client';

// Google OAuth – send Google ID token to backend
export const googleAuthAPI = (data) => {
  console.log('GOOGLE AUTH API CALLED');
  return api.post('/auth/google', data);
};

export const getMeAPI = () => api.get('/auth/me');

export const updateProfileAPI = (data) =>
  api.put('/auth/profile', data);

export const updateSkillsAPI = (skills) =>
  api.put('/auth/skills', { skills });
import api from './client';
export const loginAPI = (data) => api.post('/auth/login', data);
export const registerAPI = (data) => api.post('/auth/register', data);
export const getMeAPI = () => api.get('/auth/me');
export const updateProfileAPI = (data) => api.put('/auth/profile', data);
export const updateSkillsAPI = (skills) => api.put('/auth/skills', { skills });

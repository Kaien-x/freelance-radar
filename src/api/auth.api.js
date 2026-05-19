import api from './client';

export const loginAPI = (data) => {
  console.log(api.defaults.baseURL);
  console.log('LOGIN API CALLED');

  return api.post('/auth/login', data);
};

export const registerAPI = (data) => {
  console.log(api.defaults.baseURL);
  console.log('REGISTER API CALLED');

  return api.post('/auth/register', data);
};

export const getMeAPI = () => api.get('/auth/me');

export const updateProfileAPI = (data) =>
  api.put('/auth/profile', data);

export const updateSkillsAPI = (skills) =>
  api.put('/auth/skills', { skills });
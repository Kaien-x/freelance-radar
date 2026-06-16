import api from './client';

export const getProfileAPI = () => api.get('/users/profile');
export const updateProfileAPI = (data) => api.put('/users/profile', data);
export const updateSkillsAPI = (skills) => api.put('/users/skills', { skills });
export const updateExperienceAPI = (experience) => api.put('/users/experience', { experience });
export const uploadAvatarAPI = (formData) => api.post('/users/avatar', formData);
export const uploadResumeAPI = async (formData) => {
  const response = await api.post('/users/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

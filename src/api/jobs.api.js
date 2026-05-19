import api from './client';

export const getJobsAPI = (params) => api.get('/jobs', { params });
export const getJobAPI = (id) => api.get(`/jobs/${id}`);
export const createJobAPI = (data) => api.post('/jobs', data);
export const updateJobAPI = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJobAPI = (id) => api.delete(`/jobs/${id}`);
export const getMyJobsAPI = () => api.get('/jobs/my-jobs');
export const toggleSaveJobAPI = (id) => api.post(`/jobs/${id}/save`);
export const getSavedJobsAPI = () => api.get('/jobs/saved');

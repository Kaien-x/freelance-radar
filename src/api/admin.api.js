import api from './client';

export const getUsersCount = () => api.get('/admin/stats');
export const getAllUsers = () => api.get('/admin/users');
export const getAllJobs = () => api.get('/admin/jobs');
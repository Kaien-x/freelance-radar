import api from './client';

export const getUsersCount = () => api.get('/admin/stats');
export const getAllUsers = () => api.get('/admin/users');
export const getAllJobs = () => api.get('/admin/jobs');

export const getEmailLogs = (params) => api.get('/admin/emails', { params });
export const getEmailStats = () => api.get('/admin/emails/stats');
import api from './client';

export const applyToJobAPI = (data) => api.post('/applications', data);
export const checkAppliedAPI = (jobId) => api.get(`/applications/check/${jobId}`);
export const getJobApplicantsAPI = (jobId) => api.get(`/applications/job/${jobId}`);
export const updateApplicationStatusAPI = (applicationId, status) => api.patch(`/applications/${applicationId}/status`, { status });
export const getMyApplicationsAPI = (params) => api.get('/applications', { params });
export const getApplicationAPI = (id) => api.get(`/applications/${id}`);
export const withdrawApplicationAPI = (id) => api.delete(`/applications/${id}`);

export default {};

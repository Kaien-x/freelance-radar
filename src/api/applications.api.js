import api from './client';

export const getMyApplicationsAPI = (params) =>
  api.get('/applications', { params });

export const getApplicationAPI = (id) =>
  api.get(`/applications/${id}`);

export const applyToJobAPI = (data) =>
  api.post('/applications', data);

export const withdrawApplicationAPI = (id) =>
  api.delete(`/applications/${id}`);

export const getJobApplicantsAPI = (jobId) =>
  api.get(`/applications/job/${jobId}`);

export const updateApplicationStatusAPI = (id, status) =>
  api.patch(`/applications/${id}/status`, { status });

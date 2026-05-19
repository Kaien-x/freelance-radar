import api from './client';

export const generateProposalAPI = (data) => api.post('/proposals/generate', data);
export const getMyProposalsAPI = (params) => api.get('/proposals', { params });
export const updateProposalAPI = (id, data) => api.patch(`/proposals/${id}`, data);
export const deleteProposalAPI = (id) => api.delete(`/proposals/${id}`);

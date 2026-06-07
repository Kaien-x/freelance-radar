import api from './client';

export const joinWaitlistAPI = (data) => api.post('/waitlist', data);
export const getWaitlistAdminAPI = (params) => api.get('/admin/waitlist', { params });
export const deleteWaitlistAdminAPI = (id) => api.delete(`/admin/waitlist/${id}`);

export default {};

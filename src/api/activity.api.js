import api from './client';

export const logEvent      = (event, page = null, meta = null) => api.post('/activity', { event, page, meta }).catch(() => {});
export const getActivitySummary  = ()       => api.get('/activity/summary');
export const getUserTimeline     = (userId) => api.get(`/activity/user/${userId}`);
export const getOutreachList     = ()       => api.get('/activity/outreach-list');

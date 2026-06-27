import axios from 'axios';
import type { Opportunity, PaginatedResponse, ApiResponse } from '@opportunityos/shared';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// ─── Opportunities ────────────────────────────────────────────────────────────

export const opportunitiesApi = {
  list: (params?: {
    status?: string;
    category?: string;
    sort?: 'roi' | 'deadline' | 'created';
    page?: number;
    limit?: number;
    actionableOnly?: boolean;
  }) => api.get<PaginatedResponse<Opportunity>>('/opportunities', { params }),

  get: (id: string) =>
    api.get<ApiResponse<Opportunity>>(`/opportunities/${id}`),

  create: (data: Partial<Opportunity>) =>
    api.post<ApiResponse<Opportunity>>('/opportunities', data),

  update: (id: string, data: Partial<Opportunity> & { decisionReason?: string }) =>
    api.patch<ApiResponse<Opportunity>>(`/opportunities/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/opportunities/${id}`),
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileApi = {
  get:    ()     => api.get('/profile'),
  update: (data: unknown) => api.patch('/profile', data),
};

// ─── Goals ───────────────────────────────────────────────────────────────────

export const goalsApi = {
  list:   ()     => api.get('/goals'),
  create: (data: unknown) => api.post('/goals', data),
  update: (id: string, data: unknown) => api.patch(`/goals/${id}`, data),
};

// ─── Mission ─────────────────────────────────────────────────────────────────

export const missionApi = {
  today:         ()    => api.get('/mission/today'),
  completeItem:  (idx: number) => api.patch(`/mission/today/complete/${idx}`),
};

export default api;

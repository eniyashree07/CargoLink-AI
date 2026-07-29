import apiClient from './api';

export const dashboardService = {
  async getDashboard() {
    const response = await apiClient.get('/api/dashboard/me');
    return response;
  },

  async getAdminDashboard() {
    const response = await apiClient.get('/api/dashboard/me');
    return response;
  },

  async getOwnerDashboard() {
    const response = await apiClient.get('/api/dashboard/me');
    return response;
  },

  async getDriverDashboard() {
    const response = await apiClient.get('/api/dashboard/me');
    return response;
  },
};

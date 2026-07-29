import apiClient from './api';

export const driverService = {
  async getAllDrivers() {
    const response = await apiClient.get('/api/drivers');
    return response.drivers || [];
  },

  async getAvailableDrivers() {
    const response = await apiClient.get('/api/drivers/available');
    return response.drivers || [];
  },

  async getDriverById(id) {
    const response = await apiClient.get(`/api/drivers/${id}`);
    return response.driver;
  },

  async getDriverByUserId(userId) {
    const response = await apiClient.get(`/api/drivers/user/${userId}`);
    return response.driver;
  },

  async createDriver(driverData) {
    const response = await apiClient.post('/api/drivers', driverData);
    return response.driver;
  },

  async updateDriver(id, driverData) {
    const response = await apiClient.put(`/api/drivers/${id}`, driverData);
    return response.driver;
  },

  async deleteDriver(id) {
    const response = await apiClient.delete(`/api/drivers/${id}`);
    return response;
  },
};

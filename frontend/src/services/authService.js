import apiClient from './api';

export const authService = {
  async login(identifier, password) {
    const response = await apiClient.post('/api/auth/login', {
      identifier,
      password,
    });
    
    if (response && response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  },

  async register(userData) {
    const response = await apiClient.post('/api/auth/register', userData);
    
    if (response && response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    return response;
  },

  logout() {
    apiClient.setToken(null);
    localStorage.removeItem('cargolink_user');
    localStorage.removeItem('cargolink_owner_user');
    localStorage.removeItem('cargolink_driver_user');
    localStorage.removeItem('cargolink_admin_user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('cargolink_token');
  },

  getToken() {
    return localStorage.getItem('cargolink_token');
  },
};

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

  async demoLogin(role) {
    const response = await apiClient.post('/api/auth/demo', { role });

    if (response && response.token) {
      apiClient.setToken(response.token);
    }

    return response;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    return response;
  },

  async forgotPassword(mobile) {
    return await apiClient.post('/api/auth/forgot-password', { mobile });
  },

  async verifyOtp(mobile, otp) {
    return await apiClient.post('/api/auth/verify-otp', { mobile, otp });
  },

  async resetPassword(resetToken, newPassword) {
    return await apiClient.post('/api/auth/reset-password', { resetToken, newPassword });
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

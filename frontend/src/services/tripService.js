import apiClient from './api';

export const tripService = {
  async getAllTrips() {
    const response = await apiClient.get('/api/trips');
    return response.trips || [];
  },

  async getTripById(id) {
    const response = await apiClient.get(`/api/trips/${id}`);
    return response.trip;
  },

  async getTripsByOwner(cargoOwnerId) {
    const response = await apiClient.get(`/api/trips/owner/${cargoOwnerId}`);
    return response.trips || [];
  },

  async getTripsByDriver(driverId) {
    const response = await apiClient.get(`/api/trips/driver/${driverId}`);
    return response.trips || [];
  },

  async createTrip(tripData) {
    const response = await apiClient.post('/api/trips', tripData);
    return response.trip;
  },

  async updateTrip(id, tripData) {
    const response = await apiClient.put(`/api/trips/${id}`, tripData);
    return response.trip;
  },

  async assignDriver(tripId, driverId) {
    const response = await apiClient.patch(`/api/trips/${tripId}/assign-driver`, {
      driverId,
    });
    return response.trip;
  },

  async updateTripStatus(tripId, status) {
    const response = await apiClient.patch(`/api/trips/${tripId}/status`, {
      status,
    });
    return response.trip;
  },

  async deleteTrip(id) {
    const response = await apiClient.delete(`/api/trips/${id}`);
    return response;
  },
};

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error);
    console.log('Error response:', error.response);
    console.log('Error status:', error.response?.status);
    
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on login/register page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Listings API
export const listingsAPI = {
  // Get all listings with filters
  getListings: (params = {}) => api.get('/listings', { params }),
  
  // Get single listing
  getListing: (id) => api.get(`/listings/${id}`),
  
  // Create listing (host only)
  createListing: (data) => api.post('/listings', data),
  
  // Update listing (host only)
  updateListing: (id, data) => api.put(`/listings/${id}`, data),
  
  // Delete listing (host only)
  deleteListing: (id) => api.delete(`/listings/${id}`),
  
  // Get host's listings
  getHostListings: () => api.get('/listings/host/my-listings'),
};

// Bookings API
export const bookingsAPI = {
  // Create booking
  createBooking: (data) => api.post('/bookings', data),
  
  // Get user's bookings
  getUserBookings: () => api.get('/bookings/my-bookings'),
  
  // Get host's bookings
  getHostBookings: () => api.get('/bookings/host-bookings'),
  
  // Get single booking
  getBooking: (id) => api.get(`/bookings/${id}`),
  
  // Update booking status (host only)
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  
  // Cancel booking (guest only)
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
};

// Auth API
export const authAPI = {
  // Login
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Register
  register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
};

export default api;

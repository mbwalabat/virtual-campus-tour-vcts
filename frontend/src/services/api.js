import axios from 'axios';

export const API_BASE_URL = "http://localhost:5000";   // ✅ for static files
export const API_URL = "http://localhost:5000/api";    // ✅ for API

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getAllUsers: (params = {}) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  makeInactive: (id) => api.put(`/users/${id}/inactive`),
  makeActive: (id) => api.put(`/users/${id}/active`),
  getUserStats: () => api.get('/users/stats'),
};

export const locationsAPI = {
  getAllLocations: (params = {}) => api.get('/locations', { params }),
  getLocationById: (id) => api.get(`/locations/${id}`),
  createLocation: (locationData) => api.post('/locations', locationData),
  updateLocation: (id, locationData) => api.put(`/locations/${id}`, locationData),
  deleteLocation: (id) => api.delete(`/locations/${id}`),
  uploadLocationFiles: (id, formData, configOverrides = {}) => {
    return api.post(`/locations/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
      ...configOverrides,
    });
  },
  getLocationsByDepartment: (department) => api.get(`/locations/department/${department}`),
  getLocationStats: () => api.get('/locations/stats'),
};

// Cloudinary direct upload helpers
export const uploadsAPI = {
  getSignature: (folder) => api.post('/uploads/sign', { folder })
};

// Departments API
export const departmentsAPI = {
  getAllDepartments: (params = {}) => api.get('/departments', { params }),
  getDepartmentById: (id) => api.get(`/departments/${id}`),
  createDepartment: (departmentData) => api.post('/departments', departmentData),
  updateDepartment: (id, departmentData) => api.put(`/departments/${id}`, departmentData),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
  getDepartmentStats: () => api.get('/departments/stats'),
  getDepartmentUsers: (id, params = {}) => api.get(`/departments/${id}/users`, { params }),
  getDepartmentLocations: (id, params = {}) => api.get(`/departments/${id}/locations`, { params }),
};

export default api;

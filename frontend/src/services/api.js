import axios from 'axios';

const API_URL = 'http://127.0.0.1:3001/api';

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('medtracker_token');

// Helper to create headers with token
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

// ---- AUTH ROUTES ----

// Register
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// Login
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/auth/me`, authHeaders());
  return response.data;
};

// ---- MEDICATION ROUTES ----

// Get all medications
export const getMedications = async () => {
  const response = await axios.get(`${API_URL}/medications`, authHeaders());
  return response.data.medications;
};

// Get a single medication
export const getMedication = async (id) => {
  const response = await axios.get(`${API_URL}/medications/${id}`, authHeaders());
  return response.data.medication;
};

// Create a new medication
export const createMedication = async (medicationData) => {
  const response = await axios.post(`${API_URL}/medications`, medicationData, authHeaders());
  return response.data;
};

// Update a medication
export const updateMedication = async (id, medicationData) => {
  const response = await axios.put(`${API_URL}/medications/${id}`, medicationData, authHeaders());
  return response.data;
};

// Delete a medication
export const deleteMedication = async (id) => {
  const response = await axios.delete(`${API_URL}/medications/${id}`, authHeaders());
  return response.data;
};

// Get today's schedule
export const getTodaySchedule = async () => {
  const response = await axios.get(`${API_URL}/schedule/today`, authHeaders());
  return response.data.schedule;
};
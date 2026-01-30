import axios from 'axios';

const API_URL = 'http://127.0.0.1:3001/api';

// Get all medications
export const getMedications = async () => {
  const response = await axios.get(`${API_URL}/medications`);
  return response.data.medications;
};

// Get a single medication
export const getMedication = async (id) => {
  const response = await axios.get(`${API_URL}/medications/${id}`);
  return response.data.medication;
};

// Create a new medication
export const createMedication = async (medicationData) => {
  const response = await axios.post(`${API_URL}/medications`, medicationData);
  return response.data;
};

// Update a medication
export const updateMedication = async (id, medicationData) => {
  const response = await axios.put(`${API_URL}/medications/${id}`, medicationData);
  return response.data;
};

// Delete a medication
export const deleteMedication = async (id) => {
  const response = await axios.delete(`${API_URL}/medications/${id}`);
  return response.data;
};

// Get today's schedule
export const getTodaySchedule = async () => {
  const response = await axios.get(`${API_URL}/schedule/today`);
  return response.data.schedule;
};
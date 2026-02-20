// frontend/src/services/api.js
import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

export const enrichCompany = async (website) => {
  try {
    // Ensure URL has protocol
    let url = website;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const response = await api.post('/enrich/', { url });
    return response.data;
  } catch (error) {
    console.error('Enrichment error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Failed to make request. Please try again.');
    }
  }
};

export default api;
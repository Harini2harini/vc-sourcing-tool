// frontend/src/services/api.js
import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
// Use environment variable for API URL, fallback to live Render URL for production, then localhost for development
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://vc-sourcing-backend.onrender.com/api').replace(/\/$/, '') + '/';

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

    // Use relative path without leading slash to combine correctly with baseURL
    const response = await api.post('enrich/', { url });
    return response.data;
  } catch (error) {
    console.error('Enrichment error:', error);

    let errorMessage = 'Failed to enrich company data';

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      const data = error.response.data;
      errorMessage = `Server Error (${status}): ${data.error || 'Unknown error'}`;
      console.error(`Status: ${status}`, data);
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Connection refused or blocked by CORS.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || 'Failed to make request. Please check your connection.';
    }

    throw new Error(errorMessage);
  }
};

export default api;
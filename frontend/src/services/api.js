import axios from 'axios';
// Use environment variable for API URL, fallback to live Render URL for production
const RENDER_BACKEND_URL = 'https://vc-sourcing-backend.onrender.com/api';
let API_BASE_URL = process.env.REACT_APP_API_URL || RENDER_BACKEND_URL;

// Safety check: If running on a live domain (like Vercel) but API points to localhost, force Render backend
if (typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1' &&
  API_BASE_URL.includes('localhost')) {
  API_BASE_URL = RENDER_BACKEND_URL;
}

API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const enrichCompany = async (website) => {
  try {
    const url = website.startsWith('http') ? website : `https://${website}`;

    // Using absolute URL to bypass any baseURL joining inconsistencies
    const response = await api.post(`${API_BASE_URL}enrich/`, { url });
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
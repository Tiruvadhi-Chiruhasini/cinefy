import axios from 'axios';

// One shared Axios instance. The base URL comes from VITE_API_BASE_URL.
// In development it falls back to the local Spring Boot server.
// In production, set VITE_API_BASE_URL to your deployed backend (no trailing slash, no /api).
const configured = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = (configured || (import.meta.env.DEV ? 'http://localhost:8080' : '')).replace(/\/$/, '');

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // free hosting can take up to a minute to wake up
  headers: { 'Content-Type': 'application/json' },
});

// Convert any failure into an Error with a readable message.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    let message;
    if (data?.message) {
      message = data.message;
    } else if (error.code === 'ECONNABORTED') {
      message = 'The server took too long to respond. If it was idle, wait a moment and try again.';
    } else if (error.response) {
      message = 'The request failed. Please try again.';
    } else {
      message = 'Cannot reach the server. Check that the backend is running and VITE_API_BASE_URL is correct.';
    }
    const wrapped = new Error(message);
    wrapped.status = error.response?.status;
    wrapped.fieldErrors = data?.fieldErrors;
    return Promise.reject(wrapped);
  },
);

export default client;

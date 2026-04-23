import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to attach authorization token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log(`[API] Request to ${config.url} - Token attached (length: ${token.length})`);
        } else {
            console.warn(`[API] Request to ${config.url} - ⚠️ No token in localStorage`);
        }
        return config;
    },
    (error) => {
        console.error('[API] Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error('[API] 401 Unauthorized - Token may be invalid or expired');
            localStorage.removeItem('token');
            localStorage.removeItem('login');
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            console.error('[API] 403 Forbidden - User may not have permission');
        }
        return Promise.reject(error);
    }
);

export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
};

export default api;

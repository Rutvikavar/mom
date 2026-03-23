import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// Add interceptor to include JWT token if it exists
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && token !== 'null' && token !== 'undefined') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add interceptor to handle responses and 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If it's a 401 and the request was NOT for the login endpoint
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
            // Clear invalid or expired credentials
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to login only if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            // Return a promise that never resolves to completely halt execution 
            // and prevent Next.js error overlays while the browser redirects
            return new Promise(() => { });
        }
        return Promise.reject(error);
    }
);

export default api;

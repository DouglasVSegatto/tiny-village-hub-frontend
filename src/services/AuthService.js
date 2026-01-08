// src/services/AuthService.js

// This should match your backend's running location
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = "http://192.168.1.100:8081/api";

// --- Token Management Functions ---

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

const removeTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user'); // Also remove cached user info
};

const isAuthenticated = () => {
    return !!getAccessToken();
};

// --- API Functions (Login, Register and Refresh Token) ---

const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        // Backend returns: { accessToken, refreshToken, id, username }
        setTokens(data.accessToken, data.refreshToken);
        localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username }));
        return data;
    }

    throw new Error('Login failed: Invalid credentials.');
};


const register = async (username, password, email, neighborhood, city, state, country) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            email,
            neighborhood,
            city,
            state,
            country
        }),
    });

    if (response.ok) {
        return response.text();
    }

    const errorText = await response.text();
    throw new Error(`Registration failed: ${errorText}`);
};

const refreshToken = async () => {
    try {
        const refreshTokenValue = getRefreshToken();
        if (!refreshTokenValue) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
        });

        if (response.ok) {
            const data = await response.json();
            // Backend returns: { accessToken, refreshToken }
            setTokens(data.accessToken, data.refreshToken);
            return data.accessToken;
        }

        removeTokens();
        throw new Error('Session expired. Please log in again.');
    } catch (error) {
        removeTokens();
        throw error;
    }
};


const makeAuthenticatedRequest = async (url, options = {}) => {
    let token = getAccessToken();

    // First attempt with current token
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });

    // If 401/403, try to refresh token and retry
    if (response.status === 401 || response.status === 403) {
        try {
            token = await refreshToken();
            // Retry with new token
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (refreshError) {
            // Refresh failed, redirect to login
            window.location.href = '/login';
            throw refreshError;
        }
    }

    return response;
};


// Export all functions for use in components
export default {
    getAccessToken,
    getRefreshToken,
    setTokens,
    removeTokens,
    isAuthenticated,
    login,
    register,
    refreshToken,
    makeAuthenticatedRequest,
    API_BASE_URL,
};
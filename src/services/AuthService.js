// src/services/AuthService.js

// This should match your backend's running location
const API_BASE_URL = 'http://localhost:8080/api/auth';

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

// --- API Functions (Login and Register) ---

const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        // The backend returns: { jwt, refreshToken, id, username }
        setTokens(data.jwt, data.refreshToken);
        localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username }));
        return data;
    }

    // Throw an error to be caught by the component
    throw new Error('Login failed: Invalid credentials.');
};

const register = async (username, password, email) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
    });

    if (response.ok) {
        return response.text();
    }

    const errorText = await response.text();
    throw new Error(`Registration failed: ${errorText}`);
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
    API_BASE_URL,
};
// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

// 1. Create the Context object
const AuthContext = createContext(null);

// 2. Custom hook to easily use the context in any component
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. The Provider component that holds the state and functions
export const AuthProvider = ({ children }) => {
    // Check local storage on initial load to see if a token exists
    const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

    // Stores basic user info (id, username) retrieved from local storage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Function to handle successful login (called by Login.jsx)
    const login = (data) => {
        // Tokens are set in AuthService, here we update state
        setIsAuthenticated(true);
        setUser({ id: data.id, username: data.username });
        // The rest of the token and user data saving is handled in AuthService
    };

    // Function to handle logout
    const logout = () => {
        AuthService.removeTokens();
        setIsAuthenticated(false);
        setUser(null);
    };

    // Optional: Refresh token logic hook (to be implemented later)
    /*
    useEffect(() => {
        if (isAuthenticated) {
            // Logic to check token expiry and attempt refresh here later
        }
    }, [isAuthenticated]);
    */

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider; // Export the provider component for use in App.jsx
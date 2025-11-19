// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PropTypes from 'prop-types'; // Recommended for type checking props

/**
 * Component to guard routes that require authentication.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // If the user is NOT authenticated, redirect them to the login page.
    if (!isAuthenticated) {
        // Navigate component handles the redirect within the router
        return <Navigate to="/login" replace />;
    }

    // If the user IS authenticated, render the children component (the protected page)
    return children;
};

// Good practice: Define PropTypes
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
// src/components/Navigation.jsx (UPDATED)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Import the custom hook

const Navigation = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home page after logging out
    };

    return (
        <nav style={{ background: '#282c34', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5em', fontWeight: 'bold' }}>TinyVillageHub</Link>
            <div>
                <Link to="/list" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Item List</Link>

                {isAuthenticated ? (
                    // --- Authenticated View ---
                    <>
                        <span style={{ marginRight: '20px' }}>Hello, {user?.username}</span>
                        <Link to="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>My Profile</Link>
                        <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer', border: 'none' }}>Logout</button>
                    </>
                ) : (
                    // --- Unauthenticated View ---
                    <>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Login</Link>
                        <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
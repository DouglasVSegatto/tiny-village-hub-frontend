// src/components/Navigation.jsx (UPDATED)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navigation = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                {/* Brand */}
                <Link className="navbar-brand fw-bold" to="/">TinyVillageHub</Link>

                {/* Left side navigation */}
                <div className="navbar-nav me-auto">
                    <Link className="nav-link" to="/list">Item List</Link>
                </div>

                {/* Right side navigation */}
                <div className="d-flex align-items-center">
                    {isAuthenticated ? (
                        // --- Authenticated View with Dropdown ---
                        <div className="dropdown">
                            <a
                                href="#"
                                className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="profile"
                                        width="32"
                                        height="32"
                                        className="rounded-circle"
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                                        style={{ width: '32px', height: '32px' }}
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            fill="white"
                                            className="bi bi-person-circle"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                    </div>
                                )}
                            </a>

                            <ul className="dropdown-menu dropdown-menu-end text-small shadow">
                                <li><Link className="dropdown-item" to="/my-items">My Items</Link></li>
                                <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={handleLogout}
                                        style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>

                    ) : (
                        // --- Unauthenticated View ---
                        <div className="navbar-nav">
                            <Link className="nav-link me-2" to="/login">Login</Link>
                            <Link className="nav-link" to="/register">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;

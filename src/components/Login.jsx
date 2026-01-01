// src/components/Login.jsx 🔑

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext.jsx';
import { validatePassword } from "../utils/validation.js";

const Login = () => {
    // 1. State management for form input
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login: authContextLogin } = useAuth();

    // Hook to programmatically navigate the user after successful login
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false);

        if (!username.trim()) {
            setMessage('Username is required');
            setIsError(true);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setMessage(passwordError);
            setIsError(true);
            return;
        }

        setLoading(true);

        try {
            const userData = await AuthService.login(username, password);
            authContextLogin(userData);  // Fix: use userData instead of data
            console.log('Login successful!', userData);
            navigate('/profile');

        } catch (err) {
            console.error('Login failed:', err.message);
            setMessage(err.message || 'Login failed. Please check your credentials.');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">User Login</h2>

                            {message && (
                                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleLogin} noValidate>
                                <div className="mb-3">
                                    <label className="form-label">Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Logging In...' : 'Log In'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
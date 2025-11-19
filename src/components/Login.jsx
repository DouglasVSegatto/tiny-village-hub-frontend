// src/components/Login.jsx 🔑

import React, { useState } from 'react';
import {data, useNavigate} from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
    // 1. State management for form input
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login: authContextLogin } = useAuth();

    // Hook to programmatically navigate the user after successful login
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 2. Call the login function from the service
            const userData = await AuthService.login(username, password);

            authContextLogin(data);

            console.log('Login successful!', userData);
            navigate('/profile');

        } catch (err) {
            // 3. Handle errors (Bad Credentials, Server Error)
            console.error('Login failed:', err.message);
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>User Login</h2>
            <form onSubmit={handleLogin}>
                {/* Display error message if present */}
                {error && (
                    <div style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '10px', margin: '5px 0 15px 0', border: '1px solid #ddd', borderRadius: '4px' }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', margin: '5px 0 15px 0', border: '1px solid #ddd', borderRadius: '4px' }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 15px',
                        cursor: 'pointer',
                        backgroundColor: loading ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
            </form>
        </div>
    );
};

export default Login;
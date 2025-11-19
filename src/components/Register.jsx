// src/components/Register.jsx 🚀

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Adjust the path below if your AuthService.js is in a different location
import AuthService from '../services/AuthService';

const Register = () => {
    // 1. State management for form input
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Hook to programmatically navigate the user
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false);
        setLoading(true);

        try {
            // 2. Call the register function from the service
            const response = await AuthService.register(username, password, email);

            // 3. Handle successful registration
            setMessage(response + " You can now log in!");
            setIsError(false);

            // Optional: Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            // 4. Handle errors (e.g., Username/Email taken, Server Error)
            console.error('Registration failed:', err.message);
            setMessage(err.message || 'Registration failed. Please try again.');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>User Registration</h2>
            <form onSubmit={handleRegister}>

                {/* Display Success or Error Message */}
                {message && (
                    <div style={{ color: 'white', backgroundColor: isError ? '#dc3545' : '#28a745', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
                        {message}
                    </div>
                )}

                {/* Username Field */}
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

                {/* Email Field */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '10px', margin: '5px 0 15px 0', border: '1px solid #ddd', borderRadius: '4px' }}
                        required
                    />
                </div>

                {/* Password Field */}
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
                        backgroundColor: loading ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
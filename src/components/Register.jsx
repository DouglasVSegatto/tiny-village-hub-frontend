// src/components/Register.jsx 🚀

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Adjust the path below if your AuthService.js is in a different location
import AuthService from '../services/AuthService';
import {validateEmail, validateForm, validatePassword, validateRequired} from "../utils/validation.js";

const Register = () => {
    // 1. State management for form input
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Hook to programmatically navigate the user
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(null);
        setIsError(false);

        const requiredFields = {
            username,
            email,
            password,
            neighborhood,
            city,
            state,
            country
        };

        const requiredError = validateForm(requiredFields);
        if (requiredError) {
            setMessage(requiredError);
            setIsError(true);
            return;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            setMessage(emailError);
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
            // 2. Call the register function from the service
            const response = await AuthService.register(username, password, email, neighborhood, city, state, country);

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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">User Registration</h2>

                            {message && (
                                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleRegister} noValidate>

                                <div className="mb-3">
                                    <label className="form-label">Username:</label>
                                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email:</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password:</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Neighborhood:</label>
                                    <input type="text" className="form-control" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">City:</label>
                                    <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">State:</label>
                                    <input type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Country:</label>
                                    <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} />
                                </div>

                                <button
                                    type="submit"
                                    className={`btn ${loading ? 'btn-secondary' : 'btn-success'}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Registering...' : 'Register'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Register;
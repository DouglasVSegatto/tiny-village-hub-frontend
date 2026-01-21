// src/views/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService.js';

const Profile = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await AuthService.makeAuthenticatedRequest(`${AuthService.API_BASE_URL}/api/users/me`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;
    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border"></div></div>;
    if (!profile) return <div className="container mt-5"><div className="alert alert-danger">Failed to load profile</div></div>;

    const getInitials = (username) => username?.substring(0, 2).toUpperCase() || 'U';

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div 
                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" 
                                    style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                                >
                                    {getInitials(profile.username)}
                                </div>
                                <div className="ms-4">
                                    <h2 className="mb-1">{profile.username}</h2>
                                    <p className="text-muted mb-0">{profile.email}</p>
                                    <small className="text-muted">Member since {new Date(profile.joinDate).toLocaleDateString()}</small>
                                </div>
                            </div>

                            <hr />

                            <h5 className="mb-3">Location</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted small">Neighborhood</label>
                                    <p className="fw-semibold">{profile.neighborhood || 'Not set'}</p>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small">City</label>
                                    <p className="fw-semibold">{profile.city || 'Not set'}</p>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small">State</label>
                                    <p className="fw-semibold">{profile.state || 'Not set'}</p>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted small">Country</label>
                                    <p className="fw-semibold">{profile.country || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
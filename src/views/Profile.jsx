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
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState(null);

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

    const handleEdit = () => {
        setFormData({
            username: profile.username,
            neighborhood: profile.neighborhood || '',
            city: profile.city || '',
            state: profile.state || '',
            country: profile.country || ''
        });
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData({});
    };

    const handleSave = async () => {
        setMessage('Update endpoint not implemented yet');
        // TODO: Call API endpoint when ready
    };

    const handleImageUpload = (e) => {
        setMessage('Profile picture upload endpoint not implemented yet');
        // TODO: Call API endpoint when ready
    };

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
                                <div className="position-relative">
                                    <div 
                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" 
                                        style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                                    >
                                        {getInitials(profile.username)}
                                    </div>
                                    {editing && (
                                        <button 
                                            className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0"
                                            onClick={handleImageUpload}
                                            style={{ width: '32px', height: '32px' }}
                                        >
                                            📷
                                        </button>
                                    )}
                                </div>
                                <div className="ms-4">
                                    <h2 className="mb-1">{profile.username}</h2>
                                    <p className="text-muted mb-0">{profile.email}</p>
                                    <small className="text-muted">Member since {new Date(profile.joinDate).toLocaleDateString()}</small>
                                </div>
                            </div>

                            <hr />

                            {message && <div className="alert alert-info">{message}</div>}

                            {editing ? (
                                <>
                                    <h5 className="mb-3">Edit Profile</h5>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Username</label>
                                            <input type="text" className="form-control" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Neighborhood</label>
                                            <input type="text" className="form-control" value={formData.neighborhood} onChange={(e) => setFormData({...formData, neighborhood: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">City</label>
                                            <input type="text" className="form-control" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">State</label>
                                            <input type="text" className="form-control" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Country</label>
                                            <input type="text" className="form-control" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 mt-4">
                                        <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Location</h5>
                                        <button className="btn btn-sm btn-outline-primary" onClick={handleEdit}>Edit Profile</button>
                                    </div>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
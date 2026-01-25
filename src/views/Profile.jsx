// src/views/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService.js';
import UserService from '../services/UserService.js';

const Profile = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [logoutData, setLogoutData] = useState({ password: '' });
    const [expandedSection, setExpandedSection] = useState(null);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await AuthService.makeAuthenticatedRequest(`${AuthService.API_BASE_URL}/users/me`);
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
        setMessage(null);
    };

    const handleSave = async () => {
        if (!formData.neighborhood || !formData.city || !formData.state || !formData.country) {
            setMessage('All address fields are required');
            setIsError(true);
            return;
        }

        try {
            setLoading(true);
            await UserService.updateAddress(formData);
            setMessage('Address updated successfully!');
            setIsError(false);
            setEditing(false);
            
            const response = await AuthService.makeAuthenticatedRequest(`${AuthService.API_BASE_URL}/users/me`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            }
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setMessage('All password fields are required');
            setIsError(true);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage('New passwords do not match');
            setIsError(true);
            return;
        }

        try {
            setLoading(true);
            await UserService.changePassword(passwordData.currentPassword, passwordData.newPassword, passwordData.confirmPassword);
            
            // Clear tokens and redirect to login
            logout();
            navigate('/login', { state: { message: 'Password changed successfully! Please login with your new password.' } });
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
            setLoading(false);
        }
    };

    const handleLogoutAllDevices = async () => {
        if (!logoutData.password) {
            setMessage('Password is required');
            setIsError(true);
            return;
        }

        if (!window.confirm('Are you sure you want to logout from all devices? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            await UserService.logoutAllDevices(logoutData.password);
            logout();
            navigate('/login');
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;
    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border"></div></div>;
    if (!profile) return <div className="container mt-5"><div className="alert alert-danger">Failed to load profile</div></div>;

    const getInitials = (username) => username?.substring(0, 2).toUpperCase() || 'U';

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Left Sidebar - Tabs */}
                <div className="col-md-3">
                    <div className="list-group">
                        <button 
                            className={`list-group-item list-group-item-action ${activeTab === 'home' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('home'); setMessage(null); }}
                        >
                            🏠 Home
                        </button>
                        <button 
                            className={`list-group-item list-group-item-action ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('security'); setMessage(null); }}
                        >
                            🔒 Security
                        </button>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="col-md-9">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            {message && (
                                <div className={`alert alert-dismissible fade show ${isError ? 'alert-danger' : 'alert-success'}`}>
                                    {message}
                                    <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
                                </div>
                            )}

                            {activeTab === 'home' && (
                                <>
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" 
                                            style={{ width: '100px', height: '100px', fontSize: '2rem' }}>
                                            {getInitials(profile.username)}
                                        </div>
                                        <div className="ms-4">
                                            <h2 className="mb-1">{profile.username}</h2>
                                            <p className="text-muted mb-0">{profile.email}</p>
                                            <small className="text-muted">Member since {new Date(profile.joinDate).toLocaleDateString()}</small>
                                        </div>
                                    </div>

                                    <hr />

                                    {editing ? (
                                        <>
                                            <h5 className="mb-3">Edit Address</h5>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Neighborhood *</label>
                                                    <input type="text" className="form-control" value={formData.neighborhood} 
                                                        onChange={(e) => setFormData({...formData, neighborhood: e.target.value})} required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">City *</label>
                                                    <input type="text" className="form-control" value={formData.city} 
                                                        onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">State *</label>
                                                    <input type="text" className="form-control" value={formData.state} 
                                                        onChange={(e) => setFormData({...formData, state: e.target.value})} required />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Country *</label>
                                                    <input type="text" className="form-control" value={formData.country} 
                                                        onChange={(e) => setFormData({...formData, country: e.target.value})} required />
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
                                                <button className="btn btn-sm btn-outline-primary" onClick={handleEdit}>Edit Address</button>
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
                                </>
                            )}

                            {activeTab === 'security' && (
                                <>
                                    <h4 className="mb-4">Security Settings</h4>

                                    {/* Accordion for Security Sections */}
                                    <div className="accordion" id="securityAccordion">
                                        {/* Change Password Accordion Item */}
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button 
                                                    className={`accordion-button ${expandedSection !== 'password' ? 'collapsed' : ''}`}
                                                    type="button"
                                                    onClick={() => setExpandedSection(expandedSection === 'password' ? null : 'password')}
                                                >
                                                    Change Password
                                                </button>
                                            </h2>
                                            <div className={`accordion-collapse collapse ${expandedSection === 'password' ? 'show' : ''}`}>
                                                <div className="accordion-body">
                                                    <div className="alert alert-warning">
                                                        <small><strong>⚠️ Note:</strong> Changing your password will log you out from all devices and sessions.</small>
                                                    </div>
                                                    <div className="row g-3">
                                                        <div className="col-12">
                                                            <label className="form-label">Current Password</label>
                                                            <input 
                                                                type="password" 
                                                                className="form-control" 
                                                                value={passwordData.currentPassword}
                                                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="form-label">New Password</label>
                                                            <input 
                                                                type="password" 
                                                                className="form-control" 
                                                                value={passwordData.newPassword}
                                                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="col-12">
                                                            <label className="form-label">Confirm New Password</label>
                                                            <input 
                                                                type="password" 
                                                                className="form-control" 
                                                                value={passwordData.confirmPassword}
                                                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-primary mt-3" onClick={handleChangePassword}>Change Password</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Logout All Devices Accordion Item */}
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button 
                                                    className={`accordion-button ${expandedSection !== 'logout' ? 'collapsed' : ''}`}
                                                    type="button"
                                                    onClick={() => setExpandedSection(expandedSection === 'logout' ? null : 'logout')}
                                                >
                                                    Logout All Devices
                                                </button>
                                            </h2>
                                            <div className={`accordion-collapse collapse ${expandedSection === 'logout' ? 'show' : ''}`}>
                                                <div className="accordion-body">
                                                    <p className="text-muted">Log out from all devices where you're currently signed in. Enter your password to confirm.</p>
                                                    <div className="mb-3">
                                                        <label className="form-label">Password</label>
                                                        <input 
                                                            type="password" 
                                                            className="form-control" 
                                                            value={logoutData.password}
                                                            onChange={(e) => setLogoutData({password: e.target.value})}
                                                        />
                                                    </div>
                                                    <button className="btn btn-danger" onClick={handleLogoutAllDevices}>Logout All Devices</button>
                                                </div>
                                            </div>
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
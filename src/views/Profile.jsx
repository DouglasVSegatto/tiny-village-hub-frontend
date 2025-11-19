// src/views/Profile.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import ItemUploadForm from '../components/ItemUploadForm.jsx';

const Profile = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Protection Guard: If not logged in, redirect to login page
    if (!isAuthenticated) {
        navigate('/login');
        return null; // Return null to prevent rendering the protected content
    }

    const handleItemUploadSuccess = () => {
        console.log("Upload successful! Item list needs to be refreshed.");
        // In a real scenario, this would trigger a state change or refetch of MyItemsList
    };

    // Since isAuthenticated is true, 'user' object should be safe to access
    return (
        <div style={{ padding: '20px' }}>
            <h2>Welcome to Your Profile Dashboard, {user.username}!</h2>

            <hr style={{ margin: '20px 0' }}/>

            {/* Replace Placeholder with actual form */}
            <h3>Upload a New Item</h3>
            <ItemUploadForm onUploadSuccess={handleItemUploadSuccess} />

            {/* Placeholder for My Uploaded Items List */}
            <h3 style={{ marginTop: '40px' }}>My Uploaded Items</h3>
            <div style={{ border: '1px solid #eee', padding: '15px' }}>
                [MyItemsList Component (Will fetch data from /api/profile/my-items)]
            </div>

            {/* Placeholder for Trade Requests */}
            <h3 style={{ marginTop: '40px' }}>Incoming Trade Requests</h3>
            <div style={{ border: '1px solid #eee', padding: '15px' }}>
                [TradeRequests Component (To be built)]
            </div>
        </div>
    );
};

export default Profile;
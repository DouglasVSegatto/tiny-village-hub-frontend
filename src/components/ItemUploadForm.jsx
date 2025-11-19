// src/components/ItemUploadForm.jsx

import React, { useState } from 'react';
// import ItemService from '../services/ItemService'; // To be created next

const ItemUploadForm = ({ onUploadSuccess }) => {
    // 1. State for form fields (maps to ItemUploadDto on the backend)
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('BOOK'); // Set a default type
    const [isForTrade, setIsForTrade] = useState(true);
    const [isForDonation, setIsForDonation] = useState(false);

    // 2. State for file input
    const [imageFile, setImageFile] = useState(null);

    // 3. State for UI feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Helper: Simple list of available ItemTypes
    const itemTypes = ['BOOK', 'TOOL', 'FOOD', 'FURNITURE', 'OTHER'];


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // A. Construct the ItemUploadDto (JSON part of the request)
        const itemDto = {
            name,
            description,
            type,
            isForTrade,
            isForDonation
        };

        // B. Use FormData for the multipart request (handles JSON and File)
        const formData = new FormData();

        // Append the ItemUploadDto JSON string (Crucial for multipart Spring API)
        formData.append('itemDetails', JSON.stringify(itemDto));

        // Append the image file
        if (imageFile) {
            formData.append('imageFile', imageFile);
        } else {
            setError("Please upload an image for your item.");
            setLoading(false);
            return;
        }

        try {
            // ⚠️ NEXT STEP: You will replace this placeholder with an actual API call
            // await ItemService.createItem(formData);

            // --- Placeholder API Call Simulation ---
            console.log("Simulating item upload for:", itemDto.name);
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSuccess("Item posted successfully! Please refresh your profile.");
            setName('');
            setDescription('');
            setImageFile(null);

            if (onUploadSuccess) {
                onUploadSuccess(); // Callback to refresh the parent list
            }

        } catch (err) {
            setError(err.message || "Failed to upload item. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px', margin: '0 auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>

            {/* --- Left Column: Item Details --- */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 15px' }}>Item Details</h4>

                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />

                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" style={{ ...inputStyle, resize: 'vertical' }} />

                <label>Type:</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                    {itemTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* --- Right Column: Image and Status --- */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 15px' }}>Image and Status</h4>

                <label>Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    required
                    style={{ ...inputStyle, border: 'none', padding: '5px 0' }}
                />

                {/* Trade Status Checkboxes */}
                <div style={{ marginTop: '15px', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Availability:</label>
                    <label style={{ display: 'block' }}>
                        <input type="checkbox" checked={isForTrade} onChange={(e) => setIsForTrade(e.target.checked)} style={{ marginRight: '8px' }} />
                        Available for Trade?
                    </label>
                    <label style={{ display: 'block', marginTop: '5px' }}>
                        <input type="checkbox" checked={isForDonation} onChange={(e) => setIsForDonation(e.target.checked)} style={{ marginRight: '8px' }} />
                        Available for Donation?
                    </label>
                </div>

                {/* Submit and Feedback */}
                <button type="submit" disabled={loading} style={{ ...buttonStyle, backgroundColor: loading ? '#6c757d' : '#007bff' }}>
                    {loading ? 'Uploading...' : 'Post Item'}
                </button>

                {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
                {success && <p style={{ color: 'green', marginTop: '10px' }}>Success: {success}</p>}
            </div>
        </form>
    );
};

// Simple reusable styles
const inputStyle = {
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px'
};

const buttonStyle = {
    padding: '10px 15px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px'
};

export default ItemUploadForm;
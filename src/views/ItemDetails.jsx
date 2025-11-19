// src/views/ItemDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import ItemService from '../services/ItemService'; // (To be created later)

const ItemDetails = () => {
    // Get the dynamic part of the URL, e.g., the '123' in /items/123
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Placeholder Data ---
    const placeholderItem = {
        id: itemId,
        name: `Dynamic Item: ${itemId}`,
        description: 'This is a description loaded for a specific item. In a real app, we would fetch this from /api/items/{itemId}.',
        type: 'FURNITURE',
        isForTrade: true,
        isForDonation: false,
        ownerUsername: 'OwnerUser'
    };

    useEffect(() => {
        // In the next step, replace this placeholder logic with an actual API call:
        // ItemService.fetchItemById(itemId).then(data => setItem(data)).catch(err => setError(err.message)).finally(() => setLoading(false));

        // Placeholder simulation:
        setTimeout(() => {
            setItem(placeholderItem);
            setLoading(false);
        }, 500);

    }, [itemId]); // Rerun effect whenever the item ID in the URL changes

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading item details...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>Error: {error}</div>;
    if (!item) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Item not found.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>{item.name}</h2>
            <p style={{ color: '#555' }}>Posted by: **{item.ownerUsername}**</p>

            <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9f9f9' }}>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Available For:</strong> {item.isForTrade ? 'Trade' : ''}{item.isForTrade && item.isForDonation ? ' / ' : ''}{item.isForDonation ? 'Donation' : 'Sale'}</p>
            </div>

            {/* Placeholder for Trade Request Button (Only visible if not the owner) */}
            <button style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                Request Trade/Donation
            </button>
        </div>
    );
};

export default ItemDetails;
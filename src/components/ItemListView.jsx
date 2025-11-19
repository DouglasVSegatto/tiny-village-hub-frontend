// src/components/ItemCard.jsx 🖼️

import React from 'react';

// ItemCard component receives an 'item' object as a prop
const ItemCard = ({ item }) => {
    return (
        <div style={{
            border: '1px solid #ddd',
            padding: '15px',
            margin: '15px',
            borderRadius: '8px',
            maxWidth: '300px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            cursor: 'pointer'
        }}>
            <h3 style={{ marginBottom: '5px' }}>{item.name}</h3>

            {/* Placeholder for the image. In production, this would use a URL like item.imageUrl */}
            <div style={{
                height: '150px',
                backgroundColor: '#f0f0f0',
                margin: '10px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '4px'
            }}>


                [Image of {item.name}]

            </div>

            <p style={{ color: '#555', fontSize: '0.9em' }}>Type: {item.type}</p>
            <p style={{
                fontWeight: 'bold',
                color: item.isForTrade ? '#007bff' : (item.isForDonation ? '#28a745' : '#6c757d')
            }}>
                Status: {item.isForTrade ? 'Trade Available' : ''}
                {item.isForTrade && item.isForDonation ? ' / ' : ''}
                {item.isForDonation && 'Donation'}
                {!item.isForTrade && !item.isForDonation && 'N/A'}
            </p>

            <p style={{ fontSize: '0.8em', color: '#888' }}>Owner: {item.ownerUsername}</p>
        </div>
    );
};

export default ItemCard;
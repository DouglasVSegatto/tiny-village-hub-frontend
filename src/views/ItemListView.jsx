// src/views/ItemListView.jsx

import React from 'react';
import ItemCard from '../components/ItemCard.jsx';
import { Link } from 'react-router-dom';

// --- Placeholder Data ---
// This data mimics the structure of what your Spring Boot API returns.
const sampleItems = [
    { id: 1, name: 'Vintage Clock', type: 'FURNITURE', isForTrade: true, isForDonation: false, ownerUsername: 'UserA' },
    { id: 2, name: 'Gardening Shovel', type: 'TOOL', isForTrade: false, isForDonation: true, ownerUsername: 'UserB' },
    { id: 3, name: 'Book: Great Expectations', type: 'BOOK', isForTrade: true, isForDonation: true, ownerUsername: 'UserC' },
    { id: 4, name: 'Unopened Coffee Beans', type: 'FOOD', isForTrade: false, isForDonation: true, ownerUsername: 'UserA' },
];

const ItemListView = () => {
    return (
        <div>
            <h2>Items Available in the Village</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {/* Map the sample data to the ItemCard component */}
                {sampleItems.map(item => (
                    <Link
                        key={item.id}
                        to={`/items/${item.id}`} // Link to the detail view
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {/* The ItemCard component will need to be updated to accept the full item object.
                          Ensure your ItemCard.jsx uses {item.name}, {item.type}, etc.
                        */}
                        <ItemCard item={item} />
                    </Link>
                ))}
            </div>

            {/* Optional: Add a section for filters/search here later */}
        </div>
    );
};

export default ItemListView;
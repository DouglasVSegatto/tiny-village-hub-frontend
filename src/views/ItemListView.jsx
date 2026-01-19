// src/views/ItemListView.jsx
import React, { useState, useEffect } from 'react';
import ItemService from '../services/ItemService';
// 1. IMPORT YOUR COMPONENT
import ItemCard from '../components/ItemCard';

const ItemListView = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const itemsData = await ItemService.getAvailableItems();
                setItems(itemsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    if (loading) return <div className="container mt-4"><div className="text-center">Loading items...</div></div>;
    if (error) return <div className="container mt-4"><div className="alert alert-danger">{error}</div></div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4 fw-bold">Available Items</h2>

            {items.length === 0 ? (
                <div className="alert alert-info">No items available at the moment.</div>
            ) : (
                <div className="row">
                    {items.map(item => (
                        // 2. USE THE COMPONENT HERE
                        // We wrap it in a column div to keep the grid layout
                        <div key={item.id} className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                            <ItemCard item={item} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemListView;
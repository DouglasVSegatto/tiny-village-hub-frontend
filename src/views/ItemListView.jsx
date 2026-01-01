// src/views/ItemListView.jsx
import React, { useState, useEffect } from 'react';
import ItemService from '../services/ItemService';

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
            <h2>Available Items</h2>

            {items.length === 0 ? (
                <div className="alert alert-info">No items available at the moment.</div>
            ) : (
                <div className="row">
                    {items.map(item => (
                        <div key={item.id} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Type: {item.type} | Owner: {item.ownerUsername}
                                        </small>
                                    </p>
                                    <span className={`badge ${item.status === 'AVAILABLE' ? 'bg-success' : 'bg-secondary'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemListView;

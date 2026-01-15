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
                                    {item.imageUrls && item.imageUrls.length > 0 && (
                                        <img src={item.imageUrls[0]} alt={item.name} className="img-fluid mb-2" style={{maxHeight: '200px', objectFit: 'cover', width: '100%'}} />
                                    )}
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <div className="mb-2">
                                        <span className={`badge me-1 ${item.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}`}>
                                            {item.status}
                                        </span>
                                        <span className={`badge me-1 ${item.availabilityType === 'TRADE' ? 'bg-primary' : 'bg-info'}`}>
                                            {item.availabilityType}
                                        </span>
                                        <span className="badge bg-secondary">{item.condition}</span>
                                    </div>
                                    <div className="mb-2">
                                        <small className="text-muted d-block">Type: {item.type}</small>
                                        <small className="text-muted d-block">Owner: {item.ownerUsername}</small>
                                        <small className="text-muted d-block">Location: {item.ownerNeighbourhood}, {item.ownerCity}, {item.ownerState}</small>
                                        <small className="text-muted d-block">Posted: {new Date(item.createdAt).toLocaleDateString()}</small>
                                    </div>
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

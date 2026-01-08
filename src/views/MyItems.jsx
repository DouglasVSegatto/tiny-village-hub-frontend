import React, { useState, useEffect } from 'react';
import ItemService from '../services/ItemService';
import { useNavigate } from 'react-router-dom';

const MyItems = () => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [availabilityType, setAvailabilityType] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [myItems, setMyItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch user's items on component load
    useEffect(() => {
        fetchMyItems();
    }, []);

    const fetchMyItems = async () => {
        try {
            setItemsLoading(true);
            const items = await ItemService.getMyItems();
            setMyItems(items);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setItemsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await ItemService.createItem({
                name,
                description,
                type,
                availabilityType
            });

            setMessage('Item created successfully!');
            setIsError(false);
            // Reset form
            setName('');
            setDescription('');
            setType('');
            setAvailabilityType('');
            setShowForm(false);

            // Refresh the items list
            fetchMyItems();

        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Items</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add New Item'}
                </button>
            </div>

            {message && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            {showForm && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Create New Item</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description:</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Type:</label>
                                <select
                                    className="form-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    required
                                >
                                    <option value="">Select type...</option>
                                    <option value="BOOK">Book</option>
                                    <option value="ELECTRONICS">Electronics</option>
                                    <option value="CLOTHING">Clothing</option>
                                    <option value="FURNITURE">Furniture</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Availability:</label>
                                <select
                                    className="form-select"
                                    value={availabilityType}
                                    onChange={(e) => setAvailabilityType(e.target.value)}
                                    required
                                >
                                    <option value="">Select availability...</option>
                                    <option value="TRADE">Trade</option>
                                    <option value="LEND">Lend</option>
                                    <option value="GIVE">Give Away</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Items Table */}
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Your Items</h5>
                    {itemsLoading ? (
                        <div className="text-center">Loading your items...</div>
                    ) : myItems.length === 0 ? (
                        <div className="alert alert-info">
                            You haven't created any items yet. Click "Add New Item" to get started!
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {myItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.type}</td>
                                        <td>
                                                <span className={`badge ${item.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {item.status}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyItems;

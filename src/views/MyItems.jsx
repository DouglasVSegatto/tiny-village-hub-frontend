import React, { useState, useEffect } from 'react';
import ItemService from '../services/ItemService';
import Navigation from '../components/Navigation';

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
    const [editingItem, setEditingItem] = useState(null);
    const [condition, setCondition] = useState('');
    const [status, setStatus] = useState('');

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

    const handleEdit = (item) => {
        setEditingItem({
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            availabilityType: item.availabilityType,
            condition: item.condition,
            status: item.status
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    const handleSaveEdit = async () => {
        try {
            setLoading(true);
            await ItemService.updateItem(editingItem.id, {
                name: editingItem.name,
                description: editingItem.description,
                type: editingItem.type,
                availabilityType: editingItem.availabilityType,
                condition: editingItem.condition
            });

            setMessage('Item updated successfully!');
            setIsError(false);
            setEditingItem(null);
            fetchMyItems(); // Refresh the list

        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (itemId, newStatus) => {
        try {
            setLoading(true);
            await ItemService.updateItemStatus(itemId, newStatus);
            setMessage('Status updated successfully!');
            setIsError(false);
            fetchMyItems(); // Refresh the list
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const updateEditingItem = (field, value) => {
        setEditingItem(prev => ({
            ...prev,
            [field]: value
        }));
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
                availabilityType,
                condition,
                status
            });

            setMessage('Item created successfully!');
            setIsError(false);
            // Reset form
            setName('');
            setDescription('');
            setType('');
            setAvailabilityType('');
            setCondition('');
            setStatus('');
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
        <>
            <Navigation />
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
                                    <option value="CLOTHING">Clothing</option>
                                    <option value="TOY">Toy</option>
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
                                    <option value="DONATION">Give Away/Donate</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Condition:</label>
                                <select
                                    className="form-select"
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                    required
                                >
                                    <option value="">Select condition...</option>
                                    <option value="NEW">New</option>
                                    <option value="LIKE_NEW">Like New</option>
                                    <option value="GOOD">Good</option>
                                    <option value="FAIR">Fair</option>
                                    <option value="POOR">Poor</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status:</label>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    <option value="">Select status...</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
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

            {/* Items Table with inline editing */}
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
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Availability</th>
                                    <th>Condition</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {myItems.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.imageUrls && item.imageUrls.length > 0 ? (
                                                <img src={item.imageUrls[0]} alt={item.name} style={{width: '50px', height: '50px', objectFit: 'cover'}} />
                                            ) : (
                                                <small className="text-muted">No image</small>
                                            )}
                                        </td>
                                        <td>
                                            {editingItem?.id === item.id ? (
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={editingItem.name}
                                                    onChange={(e) => updateEditingItem('name', e.target.value)}
                                                />
                                            ) : (
                                                item.name
                                            )}
                                        </td>
                                        <td>
                                            {editingItem?.id === item.id ? (
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    rows="2"
                                                    value={editingItem.description}
                                                    onChange={(e) => updateEditingItem('description', e.target.value)}
                                                />
                                            ) : (
                                                item.description
                                            )}
                                        </td>
                                        <td>
                                            {editingItem?.id === item.id ? (
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={editingItem.type}
                                                    onChange={(e) => updateEditingItem('type', e.target.value)}
                                                >
                                                    <option value="BOOK">Book</option>
                                                    <option value="CLOTHING">Clothing</option>
                                                    <option value="TOY">Toy</option>
                                                    <option value="OTHER">Other</option>
                                                </select>
                                            ) : (
                                                item.type
                                            )}
                                        </td>
                                        <td>
                                            {editingItem?.id === item.id ? (
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={editingItem.availabilityType}
                                                    onChange={(e) => updateEditingItem('availabilityType', e.target.value)}
                                                >
                                                    <option value="TRADE">Trade</option>
                                                    <option value="DONATION">Give Away/Donate</option>
                                                </select>
                                            ) : (
                                                item.availabilityType || 'N/A'
                                            )}
                                        </td>
                                        <td>
                                            {editingItem?.id === item.id ? (
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={editingItem.condition}
                                                    onChange={(e) => updateEditingItem('condition', e.target.value)}
                                                >
                                                    <option value="NEW">New</option>
                                                    <option value="LIKE_NEW">Like New</option>
                                                    <option value="GOOD">Good</option>
                                                    <option value="FAIR">Fair</option>
                                                    <option value="POOR">Poor</option>
                                                </select>
                                            ) : (
                                                item.condition || 'N/A'
                                            )}
                                        </td>
                                        <td>
                                            {editingItem?.id === item.id ? (
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={editingItem.status}
                                                    onChange={(e) => updateEditingItem('status', e.target.value)}
                                                >
                                                    <option value="ACTIVE">Active</option>
                                                    <option value="INACTIVE">Inactive</option>
                                                    <option value="PENDING">Pending</option>
                                                    <option value="COMPLETED">Completed</option>
                                                </select>
                                            ) : (
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                    disabled={loading}
                                                >
                                                    <option value="ACTIVE">Active</option>
                                                    <option value="INACTIVE">Inactive</option>
                                                    <option value="PENDING">Pending</option>
                                                    <option value="COMPLETED">Completed</option>
                                                </select>
                                            )}
                                        </td>
                                        <td>
                                            <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                                        </td>
                                        <td>
                                            {editingItem?.id === item.id ? (
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={handleSaveEdit}
                                                        disabled={loading}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={handleCancelEdit}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </button>
                                            )}
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
        </>
    );
};

export default MyItems;

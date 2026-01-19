import React, { useState, useEffect, useRef } from 'react';
import ItemService from '../services/ItemService';

const MyItems = () => {
    // Form States
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [availabilityType, setAvailabilityType] = useState('');
    const [condition, setCondition] = useState('');
    const [status, setStatus] = useState('');

    // List & Loading States
    const [myItems, setMyItems] = useState([]);
    const [itemsLoading, setItemsLoading] = useState(true);


    const [editingItem, setEditingItem] = useState(null);
    const [originalItem, setOriginalItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    // File Input Ref
    const fileInputRef = useRef(null);

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

    // --- IMAGE ACTION HANDLERS ---

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !editingItem) return;

        try {
            setLoading(true);
            // Sending to your @PostMapping endpoint
            await ItemService.uploadImage(editingItem.id, file);

            setMessage('Image uploaded successfully!');
            setIsError(false);

            // Refresh data to show new image
            await refreshEditingItem(editingItem.id);
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
            e.target.value = null; // Clear input
        }
    };

    const handleDeleteImage = async (index) => {
        if (!window.confirm("Are you sure you want to remove this image?")) return;

        try {
            setLoading(true);
            // Sending to your @DeleteMapping("/{index}") endpoint
            await ItemService.deleteImage(editingItem.id, index);

            setMessage('Image removed.');
            setIsError(false);

            await refreshEditingItem(editingItem.id);
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    // Helper to sync state after image changes
    const refreshEditingItem = async (id) => {
        const items = await ItemService.getMyItems();
        setMyItems(items);
        const updated = items.find(i => i.id === id);
        setEditingItem(updated);
    };

    // --- ITEM DATA HANDLERS ---

    const handleEdit = (item) => {
        setEditingItem({ ...item });
        setOriginalItem({ ...item });
        setShowForm(false); // Close create form if open
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setOriginalItem(null);
    };

    const hasChanges = () => {
        if (!editingItem || !originalItem) return false;
        return editingItem.name !== originalItem.name ||
               editingItem.description !== originalItem.description ||
               editingItem.type !== originalItem.type ||
               editingItem.availabilityType !== originalItem.availabilityType ||
               editingItem.condition !== originalItem.condition ||
               editingItem.status !== originalItem.status;
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;

        try {
            setLoading(true);
            await ItemService.deleteItem(itemId);
            setMessage('Item deleted successfully!');
            setIsError(false);
            setEditingItem(null);
            setOriginalItem(null);
            fetchMyItems();
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        try {
            setLoading(true);
            await ItemService.updateItem(editingItem.id, {
                name: editingItem.name,
                description: editingItem.description,
                type: editingItem.type,
                availabilityType: editingItem.availabilityType,
                condition: editingItem.condition,
                status: editingItem.status
            });

            setMessage('Item details updated!');
            setIsError(false);
            setEditingItem(null);
            fetchMyItems();
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const updateEditingItem = (field, value) => {
        setEditingItem(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ItemService.createItem({ name, description, type, availabilityType, condition, status });
            setMessage('Item created! Now you can edit it to add pictures.');
            setIsError(false);
            setName(''); setDescription(''); setType(''); setAvailabilityType(''); setCondition(''); setStatus('');
            setShowForm(false);
            fetchMyItems();
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Inventory Management</h2>
                <button className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`} onClick={() => { setShowForm(!showForm); setEditingItem(null); }}>
                    {showForm ? 'Cancel' : '+ Add New Item'}
                </button>
            </div>

            {message && (
                <div className={`alert alert-dismissible fade show ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
                </div>
            )}

            {/* --- SECTION: EDIT ITEM (With Image Manager) --- */}
            {editingItem && (
                <div className="card mb-4 border-primary shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Edit Item & Photos</h5>
                    </div>
                    <div className="card-body">
                        <label className="form-label fw-bold mb-3">Item Gallery (Max 5 Pictures)</label>
                        <div className="d-flex gap-3 mb-4 overflow-auto pb-2">
                            {[0, 1, 2, 3, 4].map((index) => {
                                const url = editingItem.imageUrls && editingItem.imageUrls[index];
                                const isNextAvailableSlot = index === (editingItem.imageUrls ? editingItem.imageUrls.length : 0);

                                return (
                                    <div
                                        key={index}
                                        className="position-relative border rounded bg-light shadow-sm"
                                        style={{ width: '120px', height: '120px', flexShrink: 0, overflow: 'hidden' }}
                                    >
                                        {url ? (
                                            <>
                                                <img
                                                    src={url}
                                                    alt={`Attachment ${index + 1}`}
                                                    className="w-100 h-100"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                                {/* The Red X Button */}
                                                <button
                                                    className="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-1 shadow rounded-circle d-flex align-items-center justify-content-center p-0"
                                                    onClick={() => handleDeleteImage(index)}
                                                    title="Remove Image"
                                                    style={{
                                                        width: '22px',
                                                        height: '22px',
                                                        backgroundColor: 'white', // White background so the X is visible over dark photos
                                                        borderWidth: '2px'
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                                    </svg>
                                                </button>
                                            </>
                                        ) : isNextAvailableSlot ? (
                                            <button
                                                className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center border-2 border-dashed"
                                                onClick={handleUploadClick}
                                            >
                                                <span className="fs-2 fw-light">+</span>
                                                <small style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>Add Photo</small>
                                            </button>
                                        ) : (
                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted opacity-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                                    <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8zM1 5v8.001c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1H2c-.55 0-1 .45-1 1z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Hidden File Input */}
                        <input type="file" ref={fileInputRef} className="d-none" onChange={onFileChange} accept="image/*" />

                        <div className="row g-3">
                            {/* Row 1: Name and Type */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Item Name</label>
                                <input type="text" className="form-control" value={editingItem.name} onChange={(e) => updateEditingItem('name', e.target.value)} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Type</label>
                                <select className="form-select" value={editingItem.type} onChange={(e) => updateEditingItem('type', e.target.value)}>
                                    <option value="BOOK">Book</option>
                                    <option value="CLOTHING">Clothing</option>
                                    <option value="TOY">Toy</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Status</label>
                                <select className="form-select" value={editingItem.status} onChange={(e) => updateEditingItem('status', e.target.value)}>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Hidden</option>
                                    <option value="PENDING">In Discussion</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>

                            {/* Row 2: Condition and Availability (The Missing Parts) */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Condition</label>
                                <select className="form-select" value={editingItem.condition} onChange={(e) => updateEditingItem('condition', e.target.value)}>
                                    <option value="NEW">Brand New</option>
                                    <option value="LIKE_NEW">Like New</option>
                                    <option value="GOOD">Good Condition</option>
                                    <option value="FAIR">Fair Condition</option>
                                    <option value="POOR">Needs Repair</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Availability</label>
                                <select className="form-select" value={editingItem.availabilityType} onChange={(e) => updateEditingItem('availabilityType', e.target.value)}>
                                    <option value="TRADE">Trade</option>
                                    <option value="DONATION">Give Away/Donate</option>
                                    <option value="SHARE">Share</option>
                                </select>
                            </div>

                            {/* Row 3: Description */}
                            <div className="col-12">
                                <label className="form-label fw-bold">Description</label>
                                <textarea className="form-control" rows="3" value={editingItem.description} onChange={(e) => updateEditingItem('description', e.target.value)}></textarea>
                            </div>
                        </div>

                        <div className="mt-4 d-flex justify-content-between">
                            <button className="btn btn-outline-danger" onClick={() => handleDeleteItem(editingItem.id)}>
                                🗑️ Delete Item
                            </button>
                            <div className="d-flex gap-2">
                                <button className="btn btn-secondary" onClick={handleCancelEdit}>Discard Changes</button>
                                <button className="btn btn-success px-4" onClick={handleSaveEdit} disabled={loading || !hasChanges()}>
                                    {loading ? 'Saving...' : 'Save All Details'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECTION: CREATE NEW ITEM --- */}
            {showForm && (
                <div className="card mb-4 border-success shadow-sm">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">Create New Item</h5>
                    </div>
                    <div className="card-body">
                        <div className="alert alert-info mb-3">
                            <small>
                                <strong>📸 Note:</strong> You'll be able to add photos after creating the item. 
                                Just click "Edit" on your new item to upload images.
                            </small>
                        </div>
                        <div className="row g-3">
                            {/* Row 1: Name and Type */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Item Name</label>
                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Type</label>
                                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} required>
                                    <option value="">Choose...</option>
                                    <option value="BOOK">Book</option>
                                    <option value="CLOTHING">Clothing</option>
                                    <option value="TOY">Toy</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Status</label>
                                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                                    <option value="">Choose...</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Hidden</option>
                                </select>
                            </div>

                            {/* Row 2: Condition and Availability */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Condition</label>
                                <select className="form-select" value={condition} onChange={(e) => setCondition(e.target.value)} required>
                                    <option value="">Choose...</option>
                                    <option value="NEW">Brand New</option>
                                    <option value="LIKE_NEW">Like New</option>
                                    <option value="GOOD">Good Condition</option>
                                    <option value="FAIR">Fair Condition</option>
                                    <option value="POOR">Needs Repair</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Availability</label>
                                <select className="form-select" value={availabilityType} onChange={(e) => setAvailabilityType(e.target.value)} required>
                                    <option value="">Choose...</option>
                                    <option value="TRADE">Trade</option>
                                    <option value="DONATION">Give Away/Donate</option>
                                </select>
                            </div>

                            {/* Row 3: Description */}
                            <div className="col-12">
                                <label className="form-label fw-bold">Description</label>
                                <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                            </div>
                        </div>

                        <div className="mt-4 d-flex justify-content-end gap-2">
                            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn btn-success px-4" onClick={handleSubmitCreate} disabled={loading}>
                                {loading ? 'Creating...' : 'Create Item'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECTION: ITEMS TABLE --- */}
            <div className="card shadow-sm mt-4">
                <div className="card-body">
                    <h5 className="card-title mb-4">Your Inventory</h5>
                    {itemsLoading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                    ) : myItems.length === 0 ? (
                        <div className="text-center py-5 text-muted">No items found. Click add to start.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead className="table-light">
                                <tr>
                                    <th>Main Photo</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {myItems.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <img src={item.imageUrls?.[0] || 'https://via.placeholder.com/50'}
                                                 className="rounded border"
                                                 style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                 alt="thumb" />
                                        </td>
                                        <td className="fw-bold">{item.name}</td>
                                        <td>{item.type}</td>
                                        <td><span className={`badge ${item.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>{item.status}</span></td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(item)}>Edit</button>
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
import React, { useState } from 'react';

const ItemCard = ({ item }) => {
    // State to track if the lightbox is open
    const [isExpanded, setIsExpanded] = useState(false);
    // Track which image index we are looking at (shared between card and lightbox)
    const [activeIndex, setActiveIndex] = useState(0);

    const carouselId = `carousel-${item.id}`;
    const lightboxId = `lightbox-${item.id}`;

    // Helper to handle contact click
    const handleContact = (e) => {
        e.stopPropagation(); // Prevent opening lightbox if clicking button
        alert(`Contacting ${item.ownerUsername} about ${item.name}`);
    };

    return (
        <div className="card m-3 shadow-sm" style={{ width: '20rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>

            {/* --- CARD CAROUSEL --- */}
            {item.images && item.images.length > 0 ? (
                <div id={carouselId} className="carousel slide" data-bs-interval="false">
                    <div className="carousel-inner rounded-top">
                        {item.images.map((image, index) => (
                            <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
                                <img
                                    src={image}
                                    className="d-block w-100"
                                    alt={item.name}
                                    onClick={() => setIsExpanded(true)}
                                    style={{ height: '220px', objectFit: 'cover', cursor: 'zoom-in' }}
                                />
                            </div>
                        ))}
                    </div>
                    {item.images.length > 1 && (
                        <>
                            <button className="carousel-control-prev" type="button" onClick={() => setActiveIndex(activeIndex === 0 ? item.images.length - 1 : activeIndex - 1)}>
                                <span className="carousel-control-prev-icon" aria-hidden="true" style={{width: '20px'}}></span>
                            </button>
                            <button className="carousel-control-next" type="button" onClick={() => setActiveIndex(activeIndex === item.images.length - 1 ? 0 : activeIndex + 1)}>
                                <span className="carousel-control-next-icon" aria-hidden="true" style={{width: '20px'}}></span>
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="bg-light d-flex align-items-center justify-content-center rounded-top" style={{ height: '220px', color: '#ccc' }}>
                    <span>No Images</span>
                </div>
            )}

            {/* --- CARD BODY --- */}
            <div className="card-body p-3">
                <h5 className="card-title fw-bold mb-1">{item.name}</h5>
                <p className="card-text text-muted small mb-2">{item.description || "No description provided."}</p>

                <div className="d-flex flex-wrap gap-1 mb-3">
                    <span className="badge rounded-pill bg-success text-uppercase" style={{fontSize: '0.65rem'}}>Active</span>
                    {item.isForTrade && <span className="badge rounded-pill bg-primary text-uppercase" style={{fontSize: '0.65rem'}}>Trade</span>}
                    {item.isForDonation && <span className="badge rounded-pill bg-info text-uppercase" style={{fontSize: '0.65rem'}}>Donation</span>}
                    <span className="badge rounded-pill bg-secondary text-uppercase" style={{fontSize: '0.65rem'}}>Excellent</span>
                </div>

                <div className="border-top pt-2" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                    <div className="text-muted"><span className="fw-bold text-dark">Type:</span> {item.type}</div>
                    <div className="text-muted"><span className="fw-bold text-dark">Owner:</span> {item.ownerUsername}</div>
                    <div className="text-muted"><span className="fw-bold text-dark">Location:</span> Downtown, Seattle, WA</div>
                    <div className="text-muted small mt-1">Posted: 1/15/2026</div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-outline-primary btn-sm px-3" onClick={handleContact}>
                        Contact Owner
                    </button>
                </div>
            </div>

            {/* --- EXPANDED LIGHTBOX --- */}
            {isExpanded && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 1050 }}>
                    <button
                        className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
                        style={{ zIndex: 1100 }}
                        onClick={() => setIsExpanded(false)}
                    ></button>

                    <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5">
                        <div id={lightboxId} className="carousel slide w-100 h-75">
                            <div className="carousel-inner h-100 d-flex align-items-center">
                                {item.images.map((image, index) => (
                                    <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''} text-center`}>
                                        <img
                                            src={image}
                                            alt="Expanded"
                                            style={{ maxWidth: '90%', maxHeight: '70vh', objectFit: 'contain' }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {item.images.length > 1 && (
                                <>
                                    <button className="carousel-control-prev" onClick={() => setActiveIndex(activeIndex === 0 ? item.images.length - 1 : activeIndex - 1)}>
                                        <span className="carousel-control-prev-icon"></span>
                                    </button>
                                    <button className="carousel-control-next" onClick={() => setActiveIndex(activeIndex === item.images.length - 1 ? 0 : activeIndex + 1)}>
                                        <span className="carousel-control-next-icon"></span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Info & Action area below expanded image */}
                        <div className="text-white text-center mt-4">
                            <h4>{item.name}</h4>
                            <p className="small text-light">Owner: {item.ownerUsername} | Location: Seattle, WA</p>
                            <button className="btn btn-primary btn-lg mt-2 px-5" onClick={handleContact}>
                                Contact Owner Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemCard;
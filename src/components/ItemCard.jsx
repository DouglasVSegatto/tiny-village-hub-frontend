import React, { useState } from 'react';

const ItemCard = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Using your specific property name
    const images = item.imageUrls || [];

    const carouselId = `carousel-${item.id}`;

    const handleContact = (e) => {
        e.stopPropagation();
        alert(`Contacting ${item.ownerUsername} about ${item.name}`);
    };

    // Manual slide control to ensure React state and UI stay synced
    const moveSlide = (e, direction) => {
        e.stopPropagation();
        if (direction === 'next') {
            setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        } else {
            setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
    };

    return (
        <div className="card m-3 shadow-sm" style={{ width: '20rem', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>

            {/* --- CARD CAROUSEL --- */}
            {images.length > 0 ? (
                <div id={carouselId} className="carousel slide bg-dark" style={{ height: '220px' }}>
                    <div className="carousel-inner h-100">
                        {images.map((image, index) => (
                            <div key={index} className={`carousel-item h-100 ${index === activeIndex ? 'active' : ''}`}>
                                <img
                                    src={image}
                                    className="d-block w-100 h-100"
                                    alt={item.name}
                                    onClick={() => setIsExpanded(true)}
                                    style={{ objectFit: 'cover', cursor: 'zoom-in' }}
                                />
                            </div>
                        ))}
                    </div>

                    {images.length > 1 && (
                        <>
                            <button className="carousel-control-prev" type="button" onClick={(e) => moveSlide(e, 'prev')}>
                                <span className="carousel-control-prev-icon" aria-hidden="true" style={{ width: '20px' }}></span>
                            </button>
                            <button className="carousel-control-next" type="button" onClick={(e) => moveSlide(e, 'next')}>
                                <span className="carousel-control-next-icon" aria-hidden="true" style={{ width: '20px' }}></span>
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '220px', color: '#ccc' }}>
                    <div className="text-center">
                        <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
                        <p className="mb-0 small">No Images Available</p>
                    </div>
                </div>
            )}

            {/* --- CARD BODY --- */}
            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <h5 className="card-title fw-bold mb-0 text-truncate" style={{ maxWidth: '70%' }}>{item.name}</h5>
                    <span className="badge bg-success text-uppercase" style={{ fontSize: '0.6rem' }}>{item.status || 'Active'}</span>
                </div>

                <p className="card-text text-muted small mb-2" style={{ height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.description || "No description provided."}
                </p>

                <div className="d-flex flex-wrap gap-1 mb-3">
                    {item.availabilityType === 'TRADE' && <span className="badge rounded-pill bg-primary text-uppercase" style={{ fontSize: '0.6rem' }}>Trade</span>}
                    {item.availabilityType === 'DONATION' && <span className="badge rounded-pill bg-info text-dark text-uppercase" style={{ fontSize: '0.6rem' }}>Donation</span>}
                    <span className="badge rounded-pill bg-secondary text-uppercase" style={{ fontSize: '0.6rem' }}>{item.condition?.replace('_', ' ') || 'Excellent'}</span>
                </div>

                <div className="border-top pt-2 mt-2" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
                    <div className="d-flex justify-content-between">
                        <span className="text-muted">Type:</span>
                        <span className="fw-semibold">{item.type}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="text-muted">Owner:</span>
                        <span className="text-primary">{item.ownerUsername}</span>
                    </div>
                </div>

                <button className="btn btn-primary w-100 mt-3 fw-bold btn-sm" onClick={handleContact}>
                    Contact Owner
                </button>
            </div>

            {/* --- FULLSCREEN LIGHTBOX --- */}
            {isExpanded && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 2000 }}
                    onClick={() => setIsExpanded(false)}
                >
                    {/* Close Button */}
                    <button
                        className="btn-close btn-close-white position-absolute top-0 end-0 m-4 shadow-none"
                        style={{ zIndex: 2100, width: '2em', height: '2em' }}
                        onClick={() => setIsExpanded(false)}
                    ></button>

                    <div className="h-100 d-flex flex-column align-items-center justify-content-center p-2 p-md-5" onClick={(e) => e.stopPropagation()}>
                        <div className="carousel slide w-100 h-75 d-flex align-items-center justify-content-center">

                            {images.length > 1 && (
                                <button className="carousel-control-prev" type="button" onClick={(e) => moveSlide(e, 'prev')} style={{ width: '10%' }}>
                                    <span className="carousel-control-prev-icon" style={{ width: '3rem', height: '3rem' }}></span>
                                </button>
                            )}

                            <div className="carousel-inner h-100 d-flex align-items-center justify-content-center">
                                {images.map((image, index) => (
                                    <div key={index} className={`carousel-item h-100 ${index === activeIndex ? 'active' : ''} text-center`}>
                                        <img
                                            src={image}
                                            alt="Expanded view"
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {images.length > 1 && (
                                <button className="carousel-control-next" type="button" onClick={(e) => moveSlide(e, 'next')} style={{ width: '10%' }}>
                                    <span className="carousel-control-next-icon" style={{ width: '3rem', height: '3rem' }}></span>
                                </button>
                            )}
                        </div>

                        {/* Lightbox Footer Information */}
                        <div className="text-white text-center mt-4 bg-dark bg-opacity-50 p-3 rounded-3 w-75">
                            <h3 className="fw-bold">{item.name}</h3>
                            <p className="mb-3 opacity-75">Owner: {item.ownerUsername} | Condition: {item.condition}</p>
                            <button className="btn btn-light btn-lg px-5 fw-bold" onClick={handleContact}>
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemCard;
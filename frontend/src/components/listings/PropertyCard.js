import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiUsers, FiHome } from 'react-icons/fi';
import './PropertyCard.css';

const PropertyCard = ({ listing }) => {
  const {
    _id,
    title,
    images,
    location,
    price,
    propertyType,
    bedrooms,
    maxGuests,
    rating,
    host
  } = listing;

  return (
    <Link to={`/listing/${_id}`} className="property-card">
      <div className="property-image">
        <img 
          src={images[0]} 
          alt={title}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop';
          }}
        />
        <div className="property-type-badge">
          {propertyType}
        </div>
      </div>
      
      <div className="property-content">
        <div className="property-header">
          <h3 className="property-title">{title}</h3>
          <div className="property-rating">
            <FiStar className="star-icon" />
            <span>{rating.average.toFixed(1)}</span>
            <span className="review-count">({rating.count})</span>
          </div>
        </div>
        
        <div className="property-location">
          <FiMapPin className="location-icon" />
          <span>{location.city}, {location.state}</span>
        </div>
        
        <div className="property-details">
          <div className="detail-item">
            <FiHome className="detail-icon" />
            <span>{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="detail-item">
            <FiUsers className="detail-icon" />
            <span>{maxGuests} guest{maxGuests !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <div className="property-footer">
          <div className="property-price">
            <span className="price">₹{price}</span>
            <span className="price-period">/night</span>
          </div>
          <div className="property-host">
            <div className="host-avatar">
              {host?.avatar ? (
                <img src={host.avatar} alt={host.name} />
              ) : (
                <div className="avatar-placeholder">
                  {host?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="host-name">{host?.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

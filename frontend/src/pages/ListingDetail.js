import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiStar, FiUsers, FiHome, FiDroplet, FiWifi, FiTruck, FiTv, FiWind } from 'react-icons/fi';
import { listingsAPI, bookingsAPI } from '../utils/api';
import BookingForm from '../components/booking/BookingForm';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './ListingDetail.css';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getListing(id);
      setListing(response.data);
    } catch (error) {
      toast.error('Failed to fetch listing details');
      console.error('Error fetching listing:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (bookingData) => {
    if (!isAuthenticated) {
      toast.error('Please login to make a booking');
      navigate('/login');
      return;
    }

    try {
      const response = await bookingsAPI.createBooking({
        ...bookingData,
        listing: listing._id
      });
      toast.success('Booking request submitted successfully!');
      setShowBookingForm(false);
      // Optionally redirect to bookings page
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Booking failed';
      toast.error(message);
    }
  };

  const getAmenityIcon = (amenity) => {
    const amenityIcons = {
      'wifi': <FiWifi />,
      'parking': <FiTruck />,
      'tv': <FiTv />,
      'air conditioning': <FiWind />,
      'ac': <FiWind />,
    };
    
    const key = amenity.toLowerCase();
    return amenityIcons[key] || <span>•</span>;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>Listing not found</h2>
          <p>The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-detail">
      <div className="container">
        {/* Header */}
        <div className="listing-header">
          <h1 className="listing-title">{listing.title}</h1>
          <div className="listing-meta">
            <div className="rating">
              <FiStar className="star-icon" />
              <span>{listing.rating.average.toFixed(1)}</span>
              <span className="review-count">({listing.rating.count} reviews)</span>
            </div>
            <div className="location">
              <FiMapPin className="location-icon" />
              <span>{listing.location.address}, {listing.location.city}, {listing.location.state}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img 
              src={listing.images[selectedImageIndex]} 
              alt={listing.title}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop';
              }}
            />
          </div>
          <div className="image-thumbnails">
            {listing.images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${listing.title} ${index + 1}`}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=150&fit=crop';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="listing-content">
          <div className="main-content">
            {/* Property Info */}
            <div className="property-info">
              <div className="property-stats">
                <div className="stat">
                  <FiHome className="stat-icon" />
                  <span>{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="stat">
                  <FiDroplet className="stat-icon" />
                  <span>{listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="stat">
                  <FiUsers className="stat-icon" />
                  <span>{listing.maxGuests} guest{listing.maxGuests !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <div className="property-type">
                <span className="type-badge">{listing.propertyType}</span>
              </div>
            </div>

            {/* Host Info */}
            <div className="host-info">
              <h3>Hosted by {listing.host.name}</h3>
              <div className="host-details">
                <div className="host-avatar">
                  {listing.host.avatar ? (
                    <img src={listing.host.avatar} alt={listing.host.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {listing.host.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="host-text">
                  <p className="host-name">{listing.host.name}</p>
                  <p className="host-email">{listing.host.email}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description">
              <h3>About this place</h3>
              <p>{listing.description}</p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="amenities">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <div className="price-info">
                <span className="price">₹{listing.price}</span>
                <span className="price-period">/night</span>
              </div>
              
              {!showBookingForm ? (
                <button 
                  className="btn btn-primary btn-large w-full"
                  onClick={() => setShowBookingForm(true)}
                >
                  Reserve
                </button>
              ) : (
                <BookingForm
                  listing={listing}
                  onSubmit={handleBookingSubmit}
                  onCancel={() => setShowBookingForm(false)}
                />
              )}
              
              <p className="booking-note">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;

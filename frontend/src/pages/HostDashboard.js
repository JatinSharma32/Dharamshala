import React, { useState, useEffect } from 'react';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiCalendar, FiMapPin, FiUsers, FiHome } from 'react-icons/fi';
import { listingsAPI, bookingsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './HostDashboard.css';

const HostDashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    if (user?.role === 'host') {
      fetchHostData();
    }
  }, [user]);

  const fetchHostData = async () => {
    try {
      setLoading(true);
      const [listingsResponse, bookingsResponse] = await Promise.all([
        listingsAPI.getHostListings(),
        bookingsAPI.getHostBookings()
      ]);
      setListings(listingsResponse.data);
      setBookings(bookingsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch host data');
      console.error('Error fetching host data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await listingsAPI.deleteListing(listingId);
      toast.success('Listing deleted successfully');
      fetchHostData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete listing';
      toast.error(message);
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await bookingsAPI.updateBookingStatus(bookingId, status);
      toast.success('Booking status updated successfully');
      fetchHostData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update booking status';
      toast.error(message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalEarnings = bookings
    .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
    .reduce((total, booking) => total + booking.totalPrice, 0);

  if (user?.role !== 'host') {
    return (
      <div className="container">
        <div className="not-authorized">
          <h2>Access Denied</h2>
          <p>You need to be a host to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="host-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="host-welcome">
            <h1>Host Dashboard</h1>
            <p>Manage your properties and bookings</p>
          </div>
          <div className="host-stats">
            <div className="stat-card">
              <div className="stat-number">{listings.length}</div>
              <div className="stat-label">Properties</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{bookings.length}</div>
              <div className="stat-label">Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">₹{totalEarnings.toLocaleString()}</div>
              <div className="stat-label">Earnings</div>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Properties
          </button>
          <button 
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
        </div>

        {activeTab === 'listings' && (
          <div className="listings-section">
            <div className="section-header">
              <h2>My Properties</h2>
              <button className="btn btn-primary">
                <FiPlus />
                Add New Property
              </button>
            </div>

            {listings.length === 0 ? (
              <div className="no-listings">
                <h3>No properties yet</h3>
                <p>Start by adding your first property to earn money as a host!</p>
                <button className="btn btn-primary">
                  <FiPlus />
                  Add Your First Property
                </button>
              </div>
            ) : (
              <div className="listings-grid">
                {listings.map(listing => (
                  <div key={listing._id} className="listing-card">
                    <div className="listing-image">
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop';
                        }}
                      />
                      <div className={`status-badge ${listing.isActive ? 'active' : 'inactive'}`}>
                        {listing.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <div className="listing-content">
                      <h3 className="listing-title">{listing.title}</h3>
                      
                      <div className="listing-details">
                        <div className="detail-item">
                          <FiMapPin className="detail-icon" />
                          <span>{listing.location.city}, {listing.location.state}</span>
                        </div>
                        
                        <div className="detail-item">
                          <FiHome className="detail-icon" />
                          <span>{listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
                        </div>
                        
                        <div className="detail-item">
                          <FiUsers className="detail-icon" />
                          <span>{listing.maxGuests} guest{listing.maxGuests !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      
                      <div className="listing-footer">
                        <div className="listing-price">
                          <span className="price">₹{listing.price}</span>
                          <span className="price-label">/night</span>
                        </div>
                        
                        <div className="listing-actions">
                          <button className="btn btn-outline btn-small">
                            <FiEye />
                          </button>
                          <button className="btn btn-outline btn-small">
                            <FiEdit />
                          </button>
                          <button 
                            className="btn btn-outline btn-small delete-btn"
                            onClick={() => handleDeleteListing(listing._id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="section-header">
              <h2>Booking Requests</h2>
            </div>

            {bookings.length === 0 ? (
              <div className="no-bookings">
                <h3>No bookings yet</h3>
                <p>When guests book your properties, they'll appear here.</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking._id} className="booking-item">
                    <div className="booking-info">
                      <div className="booking-image">
                        <img 
                          src={booking.listing.images[0]} 
                          alt={booking.listing.title}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop';
                          }}
                        />
                      </div>
                      
                      <div className="booking-details">
                        <h4>{booking.listing.title}</h4>
                        <div className="guest-info">
                          <strong>{booking.guestDetails.name}</strong>
                          <span>{booking.guestDetails.email}</span>
                        </div>
                        <div className="booking-dates">
                          <FiCalendar className="detail-icon" />
                          <span>
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </span>
                        </div>
                        <div className="booking-guests">
                          <FiUsers className="detail-icon" />
                          <span>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="booking-status">
                      <div className={`status-badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                      <div className="booking-price">₹{booking.totalPrice}</div>
                    </div>
                    
                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}
                          >
                            Accept
                          </button>
                          <button 
                            className="btn btn-outline btn-small"
                            onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => handleBookingStatusUpdate(booking._id, 'completed')}
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;

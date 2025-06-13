import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiUser, FiClock, FiX } from 'react-icons/fi';
import { bookingsAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh bookings
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="user-welcome">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Manage your bookings and account</p>
          </div>
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-number">{bookings.length}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="stat-label">Confirmed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="bookings-section">
            <div className="section-header">
              <h2>My Bookings</h2>
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`filter-tab ${filter === 'confirmed' ? 'active' : ''}`}
                  onClick={() => setFilter('confirmed')}
                >
                  Confirmed
                </button>
                <button 
                  className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="no-bookings">
                <h3>No bookings found</h3>
                <p>
                  {filter === 'all' 
                    ? "You haven't made any bookings yet. Start exploring amazing places to stay!"
                    : `No ${filter} bookings found.`
                  }
                </p>
              </div>
            ) : (
              <div className="bookings-grid">
                {filteredBookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-image">
                      <img 
                        src={booking.listing.images[0]} 
                        alt={booking.listing.title}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop';
                        }}
                      />
                      <div className={`status-badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>
                    
                    <div className="booking-content">
                      <h3 className="booking-title">{booking.listing.title}</h3>
                      
                      <div className="booking-details">
                        <div className="detail-item">
                          <FiMapPin className="detail-icon" />
                          <span>{booking.listing.location.city}, {booking.listing.location.state}</span>
                        </div>
                        
                        <div className="detail-item">
                          <FiCalendar className="detail-icon" />
                          <span>
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </span>
                        </div>
                        
                        <div className="detail-item">
                          <FiUser className="detail-icon" />
                          <span>{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      
                      <div className="booking-footer">
                        <div className="booking-price">
                          <span className="price">₹{booking.totalPrice}</span>
                          <span className="price-label">Total</span>
                        </div>
                        
                        <div className="booking-actions">
                          {booking.status === 'pending' || booking.status === 'confirmed' ? (
                            <button 
                              className="btn btn-outline btn-small"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              <FiX />
                              Cancel
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

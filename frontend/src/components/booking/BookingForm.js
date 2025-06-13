import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiUsers, FiX } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import './BookingForm.css';

const BookingForm = ({ listing, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
    guestDetails: {
      name: user?.name || '',
      email: user?.email || '',
      phone: ''
    },
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user makes changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGuestDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      guestDetails: {
        ...prev.guestDetails,
        [field]: value
      }
    }));
    
    // Clear field error when user makes changes
    if (errors[`guestDetails.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`guestDetails.${field}`]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }
    
    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }
    
    if (formData.checkIn && formData.checkOut && formData.checkIn >= formData.checkOut) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
    }
    
    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }
    
    if (formData.guests > listing.maxGuests) {
      newErrors.guests = `Maximum ${listing.maxGuests} guests allowed`;
    }
    
    if (!formData.guestDetails.name.trim()) {
      newErrors['guestDetails.name'] = 'Name is required';
    }
    
    if (!formData.guestDetails.email.trim()) {
      newErrors['guestDetails.email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.guestDetails.email)) {
      newErrors['guestDetails.email'] = 'Email is invalid';
    }
    
    if (!formData.guestDetails.phone.trim()) {
      newErrors['guestDetails.phone'] = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const diffTime = Math.abs(formData.checkOut - formData.checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * listing.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit({
        ...formData,
        checkIn: formData.checkIn.toISOString(),
        checkOut: formData.checkOut.toISOString()
      });
    } catch (error) {
      console.error('Booking submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="booking-header">
        <h3>Book Your Stay</h3>
        <button type="button" className="close-btn" onClick={onCancel}>
          <FiX />
        </button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            <FiCalendar className="label-icon" />
            Check-in
          </label>
          <DatePicker
            selected={formData.checkIn}
            onChange={(date) => handleChange('checkIn', date)}
            selectsStart
            startDate={formData.checkIn}
            endDate={formData.checkOut}
            minDate={new Date()}
            placeholderText="Select date"
            className={`form-input ${errors.checkIn ? 'error' : ''}`}
            dateFormat="MMM dd, yyyy"
          />
          {errors.checkIn && <span className="error-message">{errors.checkIn}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <FiCalendar className="label-icon" />
            Check-out
          </label>
          <DatePicker
            selected={formData.checkOut}
            onChange={(date) => handleChange('checkOut', date)}
            selectsEnd
            startDate={formData.checkIn}
            endDate={formData.checkOut}
            minDate={formData.checkIn || new Date()}
            placeholderText="Select date"
            className={`form-input ${errors.checkOut ? 'error' : ''}`}
            dateFormat="MMM dd, yyyy"
          />
          {errors.checkOut && <span className="error-message">{errors.checkOut}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <FiUsers className="label-icon" />
          Guests
        </label>
        <select
          value={formData.guests}
          onChange={(e) => handleChange('guests', parseInt(e.target.value))}
          className={`form-input ${errors.guests ? 'error' : ''}`}
        >
          {Array.from({ length: listing.maxGuests }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} guest{i > 0 ? 's' : ''}
            </option>
          ))}
        </select>
        {errors.guests && <span className="error-message">{errors.guests}</span>}
      </div>

      {/* Guest Details */}
      <div className="guest-details">
        <h4>Guest Details</h4>
        
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            value={formData.guestDetails.name}
            onChange={(e) => handleGuestDetailsChange('name', e.target.value)}
            className={`form-input ${errors['guestDetails.name'] ? 'error' : ''}`}
            placeholder="Enter your full name"
          />
          {errors['guestDetails.name'] && <span className="error-message">{errors['guestDetails.name']}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={formData.guestDetails.email}
            onChange={(e) => handleGuestDetailsChange('email', e.target.value)}
            className={`form-input ${errors['guestDetails.email'] ? 'error' : ''}`}
            placeholder="Enter your email"
          />
          {errors['guestDetails.email'] && <span className="error-message">{errors['guestDetails.email']}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            value={formData.guestDetails.phone}
            onChange={(e) => handleGuestDetailsChange('phone', e.target.value)}
            className={`form-input ${errors['guestDetails.phone'] ? 'error' : ''}`}
            placeholder="Enter your phone number"
          />
          {errors['guestDetails.phone'] && <span className="error-message">{errors['guestDetails.phone']}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Special Requests (Optional)</label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => handleChange('specialRequests', e.target.value)}
          className="form-input form-textarea"
          placeholder="Any special requests or notes..."
          rows="3"
        />
      </div>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="price-breakdown">
          <div className="price-row">
            <span>₹{listing.price} × {nights} night{nights !== 1 ? 's' : ''}</span>
            <span>₹{total}</span>
          </div>
          <div className="price-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || nights === 0}
        >
          {loading ? 'Booking...' : `Book Now${nights > 0 ? ` - ₹${total}` : ''}`}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;

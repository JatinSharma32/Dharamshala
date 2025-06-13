const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a new booking
router.post('/', auth, [
  body('listing').notEmpty().withMessage('Listing ID is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
  body('guests').isNumeric().withMessage('Number of guests must be a number'),
  body('guestDetails.name').notEmpty().withMessage('Guest name is required'),
  body('guestDetails.email').isEmail().withMessage('Valid guest email is required'),
  body('guestDetails.phone').notEmpty().withMessage('Guest phone is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { listing: listingId, checkIn, checkOut, guests, guestDetails, specialRequests } = req.body;

    // Get the listing
    const listing = await Listing.findById(listingId).populate('host', 'name email');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if listing is active
    if (!listing.isActive) {
      return res.status(400).json({ message: 'This listing is not available for booking' });
    }

    // Check if guests exceed maximum
    if (guests > listing.maxGuests) {
      return res.status(400).json({ message: `Maximum ${listing.maxGuests} guests allowed` });
    }

    // Calculate total price (simplified calculation)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      listing: listingId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Property is not available for selected dates' });
    }

    // Create the booking
    const booking = new Booking({
      listing: listingId,
      guest: req.user._id,
      host: listing.host._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      guestDetails,
      specialRequests: specialRequests || ''
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('listing', 'title images location price')
      .populate('guest', 'name email')
      .populate('host', 'name email');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate('listing', 'title images location price')
      .populate('host', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get host's bookings (for hosts)
router.get('/host-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ host: req.user._id })
      .populate('listing', 'title images location price')
      .populate('guest', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get host bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing', 'title images location price amenities')
      .populate('guest', 'name email phone')
      .populate('host', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.guest._id.toString() !== req.user._id.toString() && 
        booking.host._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (host only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the host
    if (booking.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('listing', 'title images location price')
      .populate('guest', 'name email')
      .populate('host', 'name email');

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking (guest only)
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the guest
    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('listing', 'title images location price')
      .populate('guest', 'name email')
      .populate('host', 'name email');

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

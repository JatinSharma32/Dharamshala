const express = require('express');
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const { auth, isHost } = require('../middleware/auth');

const router = express.Router();

// Get all listings with search and filter
router.get('/', async (req, res) => {
  try {
    const {
      search,
      city,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      maxGuests,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms);
    }

    if (maxGuests) {
      query.maxGuests = { $gte: parseInt(maxGuests) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const listings = await Listing.find(query)
      .populate('host', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'name avatar email phone');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new listing (hosts only)
router.post('/', auth, isHost, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('propertyType').notEmpty().withMessage('Property type is required'),
  body('bedrooms').isNumeric().withMessage('Bedrooms must be a number'),
  body('bathrooms').isNumeric().withMessage('Bathrooms must be a number'),
  body('maxGuests').isNumeric().withMessage('Max guests must be a number'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const listingData = {
      ...req.body,
      host: req.user._id
    };

    const listing = new Listing(listingData);
    await listing.save();

    const populatedListing = await Listing.findById(listing._id)
      .populate('host', 'name avatar');

    res.status(201).json({
      message: 'Listing created successfully',
      listing: populatedListing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update listing (host only)
router.put('/:id', auth, isHost, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is the host of this listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'name avatar');

    res.json({
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete listing (host only)
router.delete('/:id', auth, isHost, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is the host of this listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get host's listings
router.get('/host/my-listings', auth, isHost, async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id })
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error('Get host listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

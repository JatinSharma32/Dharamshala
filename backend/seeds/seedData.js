const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'host',
        phone: '+1234567890',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'host',
        phone: '+1234567891',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b5f8b7c0?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'guest',
        phone: '+1234567892',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'host',
        phone: '+1234567893',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      }
    ];

    const createdUsers = await User.create(users);
    console.log('Users created');

    // Create listings
    const listings = [      {
        title: 'Mountain View Cottage',
        description: 'Cozy cottage with stunning mountain views in Dharamshala. Perfect for peaceful getaways with panoramic Himalayan vistas and modern amenities.',
        price: 120,
        location: {
          address: '123 Mountain View Road',
          city: 'Dharamshala',
          state: 'Himachal Pradesh',
          country: 'India',
          coordinates: {
            latitude: 32.2190,
            longitude: 76.3234
          }
        },
        images: [
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
        ],
        amenities: ['Mountain View', 'WiFi', 'Fireplace', 'Kitchen', 'Parking', 'Garden'],
        propertyType: 'cottage',
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        host: createdUsers[0]._id,
        rating: {
          average: 4.8,
          count: 24
        }
      },      {
        title: 'Himalayan Forest Retreat',
        description: 'Secluded retreat surrounded by pine forests with breathtaking valley views. Ideal for meditation and nature lovers seeking tranquility.',
        price: 200,
        location: {
          address: '456 Forest Path',
          city: 'McLeod Ganj',
          state: 'Himachal Pradesh',
          country: 'India',
          coordinates: {
            latitude: 32.2396,
            longitude: 76.3205
          }
        },
        images: [
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600&fit=crop'
        ],
        amenities: ['Forest View', 'WiFi', 'Meditation Area', 'Kitchen', 'Parking', 'Hiking Trails'],
        propertyType: 'villa',
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        host: createdUsers[1]._id,
        rating: {
          average: 4.9,
          count: 18
        }
      },      {
        title: 'Traditional Tibetan Homestay',
        description: 'Experience authentic Tibetan culture in this traditional homestay. Features beautiful Tibetan architecture with modern comfort and mountain views.',
        price: 80,
        location: {
          address: '789 Temple Road',
          city: 'Dharamshala',
          state: 'Himachal Pradesh',
          country: 'India',
          coordinates: {
            latitude: 32.2190,
            longitude: 76.3234
          }
        },
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=600&fit=crop'
        ],
        amenities: ['Cultural Experience', 'WiFi', 'Traditional Kitchen', 'Prayer Room', 'Garden'],
        propertyType: 'homestay',
        bedrooms: 3,
        bathrooms: 3,
        maxGuests: 6,
        host: createdUsers[0]._id,
        rating: {
          average: 4.7,
          count: 12
        }
      },
      {
        title: 'Charming Studio in Arts District',
        description: 'Artistic studio apartment in the vibrant arts district. Perfect for creative travelers and those who appreciate culture. Walking distance to galleries and cafes.',
        price: 80,
        location: {
          address: '321 Arts Lane',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          coordinates: {
            latitude: 28.7041,
            longitude: 77.1025
          }
        },
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
        ],
        amenities: ['WiFi', 'Kitchen', 'Art Supplies', 'Coffee Machine', 'Books'],
        propertyType: 'studio',
        bedrooms: 1,
        bathrooms: 1,
        maxGuests: 2,
        host: createdUsers[3]._id,
        rating: {
          average: 4.5,
          count: 31
        }
      },
      {
        title: 'Family Townhouse with Garden',
        description: 'Spacious family-friendly townhouse with a beautiful garden. Perfect for families with children. Quiet neighborhood with parks and schools nearby.',
        price: 200,
        location: {
          address: '654 Garden Street',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          coordinates: {
            latitude: 18.5204,
            longitude: 73.8567
          }
        },
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&h=600&fit=crop'
        ],
        amenities: ['Garden', 'WiFi', 'Kitchen', 'Parking', 'Child-friendly', 'Pet-friendly'],
        propertyType: 'townhouse',
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        host: createdUsers[1]._id,
        rating: {
          average: 4.6,
          count: 28
        }
      },
      {
        title: 'Modern Loft in Tech Hub',
        description: 'Contemporary loft apartment in the heart of the tech district. Perfect for business travelers and digital nomads. High-speed internet and workspace included.',
        price: 180,
        location: {
          address: '987 Innovation Drive',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          coordinates: {
            latitude: 17.3850,
            longitude: 78.4867
          }
        },
        images: [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=600&fit=crop'
        ],
        amenities: ['High-speed WiFi', 'Workspace', 'Kitchen', 'Gym', 'Parking', 'AC'],
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        host: createdUsers[3]._id,
        rating: {
          average: 4.4,
          count: 19
        }
      }
    ];

    const createdListings = await Listing.create(listings);
    console.log('Listings created');

    // Create some sample bookings
    const bookings = [
      {
        listing: createdListings[0]._id,
        guest: createdUsers[2]._id,
        host: createdListings[0].host,        checkIn: new Date('2025-07-15'),
        checkOut: new Date('2025-07-20'),
        guests: 2,
        totalPrice: 750,
        status: 'confirmed',
        guestDetails: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+1234567892'
        },
        specialRequests: 'Late check-in requested',
        paymentStatus: 'paid'
      },
      {
        listing: createdListings[1]._id,
        guest: createdUsers[2]._id,
        host: createdListings[1].host,        checkIn: new Date('2025-08-01'),
        checkOut: new Date('2025-08-07'),
        guests: 4,
        totalPrice: 1800,
        status: 'pending',
        guestDetails: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+1234567892'
        },
        specialRequests: 'Anniversary celebration',
        paymentStatus: 'pending'
      }
    ];

    await Booking.create(bookings);
    console.log('Bookings created');

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

# Dharamshala - Mountain Property Rental Platform

A modern, full-stack property rental application built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform allows users to discover, book, and manage mountain property rentals in the beautiful Himalayan region of Dharamshala.

## 🚀 Features

### Frontend Features

- **Modern UI/UX**: Clean, responsive design with dark mode support
- **Property Listings**: Browse mountain properties with advanced search and filtering
- **Property Details**: Detailed property pages with image galleries and booking forms
- **User Authentication**: Secure login/register with JWT tokens
- **Guest Dashboard**: View and manage bookings
- **Host Dashboard**: Property and booking management for hosts
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Backend Features

- **RESTful API**: Well-structured API endpoints for all operations
- **User Authentication**: JWT-based authentication with role-based access
- **Property Management**: Full CRUD operations for property listings
- **Booking System**: Complete booking workflow with status management
- **Data Validation**: Input validation and error handling
- **Database Integration**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

### Frontend

- **React.js**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **React DatePicker**: Date selection for bookings
- **React Icons**: Consistent iconography
- **React Toastify**: User notifications
- **Axios**: HTTP client for API requests
- **CSS3**: Custom styling with CSS variables and grid/flexbox layouts

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Express Validator**: Input validation middleware
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variables management

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone <repository-url>
cd property-rental-app
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start the frontend development server
npm start
```

### 4. Database Setup

```bash
# Make sure MongoDB is running, then seed the database
cd backend
npm run seed
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/property_rental
JWT_SECRET=your_jwt_secret_key_here_replace_in_production
NODE_ENV=development
```

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Listings

- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (host only)
- `PUT /api/listings/:id` - Update listing (host only)
- `DELETE /api/listings/:id` - Delete listing (host only)
- `GET /api/listings/host/my-listings` - Get host's listings

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/host-bookings` - Get host's bookings
- `GET /api/bookings/:id` - Get single booking
- `PATCH /api/bookings/:id/status` - Update booking status (host only)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (guest only)

## 👤 Demo Accounts

The application comes with pre-seeded demo accounts:

### Host Account

- **Email**: john@example.com
- **Password**: password123
- **Role**: Host (can manage properties and bookings)

### Guest Account

- **Email**: mike@example.com
- **Password**: password123
- **Role**: Guest (can make bookings)

## 🎨 Key Features Implemented

### 1. Property Listings

- Grid layout with property cards
- Search functionality by location and keywords
- Advanced filtering (property type, price range, bedrooms, guests)
- Pagination support
- Responsive design

### 2. Property Details

- Image gallery with thumbnail navigation
- Comprehensive property information
- Host details and contact information
- Interactive booking form
- Price calculation
- Guest authentication check

### 3. Booking System

- Date selection with validation
- Guest information collection
- Real-time price calculation
- Booking confirmation and management
- Status tracking (pending, confirmed, cancelled, completed)

### 4. User Management

- Secure authentication with JWT
- Role-based access control (guest, host, admin)
- User profiles and preferences
- Password hashing and validation

### 5. Dashboard Features

- **Guest Dashboard**: View and manage bookings, cancel bookings
- **Host Dashboard**: Manage properties, view bookings, update booking status
- Statistics and analytics
- Action buttons for common tasks

## 🚦 Getting Started (Quick Start)

1. **Start MongoDB** (if running locally)
2. **Backend**: `cd backend && npm install && npm run dev`
3. **Frontend**: `cd frontend && npm install && npm start`
4. **Seed Data**: `cd backend && npm run seed`
5. **Access**: Open http://localhost:3000

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:

- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (below 768px)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Role-based route protection

## 🎯 Future Enhancements

- Image upload functionality
- Payment integration
- Real-time chat between hosts and guests
- Review and rating system
- Email notifications
- Advanced search with map integration
- Multi-language support
- Admin panel for platform management

## 📄 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

This is a demo project, but feedback and suggestions are welcome!

## 📞 Support

For any questions or issues, please refer to the documentation or create an issue in the repository.

---

**Built with ❤️ using the MERN Stack**

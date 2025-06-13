import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMap } from 'react-icons/fi';
import { listingsAPI } from '../utils/api';
import PropertyCard from '../components/listings/PropertyCard';
import { toast } from 'react-toastify';
import './Home.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    maxGuests: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);  const fetchListings = async (searchFilters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(searchFilters).toString();
      const url = `${API_BASE_URL}/listings${queryParams ? `?${queryParams}` : ''}`;
      
      console.log('Fetching listings from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setListings(data.listings);
    } catch (error) {
      toast.error(`Failed to fetch listings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    fetchListings(searchFilters);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      maxGuests: ''
    });
    fetchListings();
  };  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">        <div className="hero-content">
          <h1 className="hero-title">Discover Dharamshala Mountain Retreats</h1>
          <p className="hero-subtitle">
            Find unique mountain properties and create memorable experiences in the Himalayas
          </p>
          
          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-row">
              <div className="search-field">
                <label>Where</label>
                <input
                  type="text"
                  name="search"
                  placeholder="Search destinations"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="search-field">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="search-field">
                <label>Guests</label>
                <select
                  name="maxGuests"
                  value={filters.maxGuests}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="4">4 guests</option>
                  <option value="6">6+ guests</option>
                </select>
              </div>
              <button type="submit" className="search-btn">
                <FiSearch />
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="listings-section">
        <div className="container">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-left">
              <h2>
                {listings.length} {listings.length === 1 ? 'property' : 'properties'} found
              </h2>
            </div>
            <div className="filter-right">
              <button 
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="advanced-filters">
              <div className="filter-grid">
                <div className="filter-group">
                  <label>Property Type</label>
                  <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Bedrooms</label>
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any</option>
                    <option value="1">1 bedroom</option>
                    <option value="2">2 bedrooms</option>
                    <option value="3">3 bedrooms</option>
                    <option value="4">4+ bedrooms</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Min Price (₹)</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-group">
                  <label>Max Price (₹)</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <div className="filter-actions">
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                  Clear All
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSearch}>
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Listings Grid */}
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.length > 0 ? (
                listings.map(listing => (
                  <PropertyCard key={listing._id} listing={listing} />
                ))
              ) : (
                <div className="no-results">
                  <h3>No properties found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiHome, FiMoon, FiSun } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <FiHome className="brand-icon" />
            <span className="brand-text">Dharamshala</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="search-bar desktop-only">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Where are you going?"
                className="search-input"
              />
              <button className="search-button">
                <FiSearch />
              </button>
            </div>
          </div>

          {/* Navigation Links */}          <div className="navbar-nav">
            <button className="theme-toggle" onClick={toggleDarkMode}>
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
            
            <button className="mobile-menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Desktop Navigation */}
            <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="nav-link">
                    My Bookings
                  </Link>
                  {user?.role === 'host' && (
                    <Link to="/host-dashboard" className="nav-link">
                      Host Dashboard
                    </Link>
                  )}
                  
                  {/* User Menu */}
                  <div className="user-menu">
                    <button className="user-menu-toggle" onClick={toggleUserMenu}>
                      <div className="user-avatar">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} />
                        ) : (
                          <FiUser />
                        )}
                      </div>
                      <span className="user-name">{user?.name}</span>
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="user-dropdown">
                        <div className="user-info">
                          <div className="user-name-large">{user?.name}</div>
                          <div className="user-email">{user?.email}</div>
                          <div className="user-role">{user?.role}</div>
                        </div>
                        <hr />
                        <Link to="/dashboard" className="dropdown-link">
                          <FiUser /> My Profile
                        </Link>
                        <button className="dropdown-link logout-btn" onClick={handleLogout}>
                          <FiLogOut /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mobile-search">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Where are you going?"
              className="search-input"
            />
            <button className="search-button">
              <FiSearch />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

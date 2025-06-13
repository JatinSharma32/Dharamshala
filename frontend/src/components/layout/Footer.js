import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">          <div className="footer-section">
            <div className="footer-brand">
              <FiHome className="brand-icon" />
              <h3>Dharamshala</h3>
            </div>
            <p className="footer-description">
              Find your perfect mountain stay with Dharamshala. Discover unique properties 
              and create memorable experiences in the Himalayas.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <FiMail className="contact-icon" />
                <span>support@dharamshala.com</span>
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FiMapPin className="contact-icon" />
                <span>123 Travel Street, Adventure City</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="/investors">Investors</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Community</h4>
            <ul className="footer-links">
              <li><Link to="/host">Become a Host</Link></li>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/safety">Safety</Link></li>
              <li><Link to="/community">Community</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/cancellation">Cancellation Options</Link></li>
              <li><Link to="/disability">Disability Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Dharamshala. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

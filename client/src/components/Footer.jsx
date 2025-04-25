import React from 'react';
import '../assets/styles/Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-wrapper">
        <div className="footer-col logo-col">
          <h3>Odyssey</h3>
          <p>Your AI-Powered Travel Companion making journey planning effortless and intelligent.</p>
          <div className="footer-socials">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTiktok /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-col newsletter">
          <h4>Newsletter</h4>
          <p>Subscribe to our newsletter for travel tips and exclusive offers.</p>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </div>
      <hr />
      <div className="footer-bottom">
        <p>&copy; {year} Odyssey. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

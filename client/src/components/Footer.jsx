import React from 'react';
import '../assets/styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Odyssey</h3>
            <p>Your Premium Travel Companion</p>
          </div>
          
          <div className="footer-links">
            <div className="links-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#mobile">Mobile App</a></li>
              </ul>
            </div>
            
            <div className="links-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#faq">FAQs</a></li>
              </ul>
            </div>
            
            <div className="links-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-social">
            <h4>Connect With Us</h4>
            <div className="social-icons">
              <a href="#facebook" className="social-icon facebook"></a>
              <a href="#twitter" className="social-icon twitter"></a>
              <a href="#instagram" className="social-icon instagram"></a>
              <a href="#linkedin" className="social-icon linkedin"></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Odyssey Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
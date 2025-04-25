import React from 'react';
import { Link } from 'react-router-dom';
import "../assets/styles/Landing.css";

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Odyssey</h1>
          <p>Your Premium Travel Companion</p>
          <Link to="/register" className="cta-button">Get Started Today</Link>
        </div>
        <div className="travel-icons">
          <div className="icon airplane"></div>
          <div className="icon bus"></div>
          <div className="icon car"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Odyssey?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon travel"></div>
            <h3>Smart Planning</h3>
            <p>Effortlessly organize all your travel details in one secure place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon budget"></div>
            <h3>Trip Management</h3>
            <p>Keep track of your itinerary, budget, and accommodation details.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon intelligence"></div>
            <h3>Travel Intelligence</h3>
            <p>Get personalized recommendations based on your travel history.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Share Your Trip</h3>
            <p>Enter your destination, dates, and travel preferences.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Planning</h3>
            <p>Our system creates personalized recommendations and itineraries.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Travel with Confidence</h3>
            <p>Access your plans anytime, anywhere, even offline.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

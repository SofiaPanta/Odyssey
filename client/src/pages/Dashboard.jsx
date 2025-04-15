import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Dashboard.css';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    pastTrips: 0,
    upcomingTrips: 0,
    currentTrips: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Please login first.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/trips', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tripData = response.data;
        setTrips(tripData);

        const now = new Date();
        const past = tripData.filter(
          (trip) => new Date(trip.departureDate) < now
        ).length;
        const current = tripData.filter(
          (trip) =>
            new Date(trip.arrivalDate) <= now &&
            new Date(trip.departureDate) >= now
        ).length;
        const upcoming = tripData.filter(
          (trip) => new Date(trip.arrivalDate) > now
        ).length;

        setStats({
          pastTrips: past,
          upcomingTrips: upcoming,
          currentTrips: current,
        });
      } catch (err) {
        console.error('Failed to fetch trips:', err);
        setError('Failed to fetch trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [navigate]);

  const upcomingTrips = trips.filter(
    (trip) => new Date(trip.arrivalDate) > new Date()
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Main Dashboard</h1>
        <Link to="/trips/new" className="new-trip-btn">
          + New Trip
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading your trips...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {/* Trip Stats */}
          <div className="trip-stats">
            <div className="stat-card">
              <h3>Past Trips</h3>
              <div className="stat-value">{stats.pastTrips}</div>
            </div>
            <div className="stat-card">
              <h3>Current Trips</h3>
              <div className="stat-value">{stats.currentTrips}</div>
            </div>
            <div className="stat-card">
              <h3>Upcoming Trips</h3>
              <div className="stat-value">{stats.upcomingTrips}</div>
            </div>
          </div>

          {/* Upcoming Trips Section */}
          <section className="upcoming-trips">
            <h2>Upcoming Trips</h2>

            {upcomingTrips.length === 0 ? (
              <div className="no-trips">
                <p>You don't have any upcoming trips planned.</p>
                <Link to="/trips/new" className="secondary-btn">
                  Plan a Trip
                </Link>
              </div>
            ) : (
              <div className="trip-cards-grid">
                {upcomingTrips.map((trip) => (
                  <Link key={trip._id} to={`/trips/${trip._id}`} className="trip-card">
                    <h3>{trip.tripName}</h3>
                    <p>
                      {new Date(trip.arrivalDate).toLocaleDateString()} –{' '}
                      {new Date(trip.departureDate).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;

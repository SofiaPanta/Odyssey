import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TripTab from '../components/TripTab';
import '../assets/styles/Trip.css';

const Trip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    tripName: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        if (tripId === 'new') {
          setTrip(null);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        setTrip(data);
        setFormData({
          tripName: data.tripName || '',
          startDate: data.arrivalDate?.split('T')[0] || '',
          endDate: data.departureDate?.split('T')[0] || '',
        });
      } catch (error) {
        console.error('Error fetching trip:', error);
        setError('Failed to load trip details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (tripId === 'new') {
        const response = await axios.post(
          '/api/trips',
          {
            tripName: formData.tripName,
            arrivalDate: formData.startDate,
            departureDate: formData.endDate,
          },
          { headers }
        );

        navigate(`/trips/${response.data._id}`);
      } else {
        await axios.put(
          `/api/trips/${tripId}`,
          {
            tripName: formData.tripName,
            arrivalDate: formData.startDate,
            departureDate: formData.endDate,
          },
          { headers }
        );
      }
    } catch (error) {
      console.error('Error saving trip:', error);
      setError('Failed to save trip. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting trip:', error);
      setError('Failed to delete trip. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="trip-container">
      {error && <div className="error-message">{error}</div>}

      <div className="trip-header">
        <h1>{tripId === 'new' ? 'Create New Trip' : formData.tripName}</h1>
        {tripId !== 'new' && (
          <div className="trip-dates">
            {formData.startDate && formData.endDate &&
              `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`}
          </div>
        )}
      </div>

      {/* Show TripTab and Overview only after trip is created */}
      {tripId !== 'new' && <TripTab />}

      <div className="trip-content">
        <form onSubmit={handleSubmit} className="trip-form">
          <div className="form-group">
            <label htmlFor="tripName">Trip Name</label>
            <input
              type="text"
              id="tripName"
              name="tripName"
              value={formData.tripName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              {tripId === 'new' ? 'Create Trip' : 'Save Changes'}
            </button>

            {tripId !== 'new' && (
              <button
                type="button"
                className="danger-btn"
                onClick={handleDelete}
              >
                Delete Trip
              </button>
            )}
          </div>
        </form>

        {tripId !== 'new' && (
          <div className="trip-overview-cards">
            {/* Trip Overview */}
            <div className="overview-card">
              <h3>Trip Overview</h3>
              <p>
                <strong>Duration</strong>
                <span>
                  {formData.startDate && formData.endDate
                    ? `${Math.ceil(
                        (new Date(formData.endDate) - new Date(formData.startDate)) /
                        (1000 * 60 * 60 * 24)
                      )} days`
                    : 'N/A'}
                </span>
              </p>
              <p>
                <strong>Total Budget</strong>
                <span>€3,500</span>
              </p>
              <p>
                <strong>Spent</strong>
                <span>€1,200</span>
              </p>
            </div>

            {/* Weather Forecast */}
            <div className="overview-card">
              <h3>Weather Forecast</h3>
              <div className="weather-row">
                <span>March 15</span>
                <span>☀️ 18°C</span>
              </div>
              <div className="weather-row">
                <span>March 16</span>
                <span>❄️ 20°C</span>
              </div>
            </div>

            {/* Travel Documents */}
            <div className="overview-card">
              <div className="card-header">
                <h3>Travel Documents</h3>
                <a href="#" className="upload-link">Upload New</a>
              </div>
              <ul className="documents-list">
                <li>
                  <span className="dot" /> Flight Tickets <a href="#">View</a>
                </li>
                <li>
                  <span className="dot" /> Hotel Reservation <a href="#">View</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trip;

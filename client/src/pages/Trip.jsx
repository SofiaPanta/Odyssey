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
  const [budgets, setBudgets] = useState([]);
  const [weather, setWeather] = useState(null);
  const [documents, setDocuments] = useState([]); // ✅ ADDED

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
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const tripResponse = await axios.get(`/api/trips/${tripId}`, config);
        const tripData = tripResponse.data;

        setTrip(tripData);
        setFormData({
          tripName: tripData.tripName || '',
          startDate: tripData.arrivalDate?.split('T')[0] || '',
          endDate: tripData.departureDate?.split('T')[0] || '',
        });

        console.log(tripData);
        setDocuments(tripData.documents || []);

        const budgetResponse = await axios.get(
          `/api/budgets/trips/${tripId}`,
          config
        );
        setBudgets(budgetResponse.data);

        if (tripData.tripName) {
          fetchWeather(tripData.tripName);
        }
      } catch (error) {
        console.error('Error fetching trip or budgets:', error);
        setError('Failed to load trip details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const fetchWeather = async (destination) => {
    try {
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          destination
        )}`
      );
      const location = geoRes.data.results?.[0];
      if (!location) return;

      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );

      setWeather(weatherRes.data.daily);
    } catch (err) {
      console.error('Error fetching weather:', err);
    }
  };

  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file); // Field name must match 'document'

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/trips/${tripId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle successful upload
    } catch (error) {
      console.error('Upload failed:', error);
      // Handle error
    }
  };

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

  const spent = budgets.reduce((sum, entry) => sum + entry.amount, 0);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="trip-container">
      {error && <div className="error-message">{error}</div>}

      <div className="trip-header">
        <h1>{tripId === 'new' ? 'Create New Trip' : formData.tripName}</h1>
        {tripId !== 'new' && (
          <div className="trip-dates">
            {formData.startDate &&
              formData.endDate &&
              `${new Date(
                formData.startDate
              ).toLocaleDateString()} - ${new Date(
                formData.endDate
              ).toLocaleDateString()}`}
          </div>
        )}
      </div>

      {tripId !== 'new' && <TripTab />}

      <div className="trip-content">
        {/* Form */}
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
                        (new Date(formData.endDate) -
                          new Date(formData.startDate)) /
                          (1000 * 60 * 60 * 24)
                      )} days`
                    : 'N/A'}
                </span>
              </p>
              <p>
                <strong>Total Budget</strong>
                <span>€{trip?.totalBudget?.toLocaleString() || 0}</span>
              </p>
              <p>
                <strong>Spent</strong>
                <span>€{spent.toLocaleString()}</span>
              </p>
            </div>

            {/* Weather Forecast */}
            {weather && (
              <div className="overview-card">
                <h3>Weather Forecast</h3>
                {weather.time.map((day, index) => (
                  <div className="weather-row" key={day}>
                    <span>{new Date(day).toLocaleDateString()}</span>
                    <span>
                      🌡 {weather.temperature_2m_min[index]}°C -{' '}
                      {weather.temperature_2m_max[index]}°C
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Travel Documents */}
            <div className="overview-card">
              <div className="card-header">
                <h3>Travel Documents</h3>
                <label htmlFor="upload-pdf" className="upload-link">
                  Upload New
                </label>
                <input
                  type="file"
                  id="upload-pdf"
                  accept="application/pdf"
                  onChange={handleUploadDocument}
                  style={{ display: 'none' }}
                />
              </div>
              <ul className="documents-list">
  {documents.length === 0 ? (
    <li>No documents uploaded yet.</li>
  ) : (
    documents.map((doc, idx) => (
      <li key={idx}>
        <span className="dot" />
        <a
          href={`http://localhost:2000/uploads/documents/${doc}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {doc}
        </a>
      </li>
    ))
  )}
</ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trip;

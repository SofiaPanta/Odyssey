import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Restaurants.css';
import TripTab from '../components/TripTab';
import TripHeader from '../components/TripHeader';

const Restaurants = () => {
  const { tripId } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    cuisine: '',
    price: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/trips/${tripId}/restaurants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRestaurants(res.data);
      } catch (err) {
        console.error('Failed to fetch restaurants', err);
        setError('Unable to load restaurants');
      }
    };

    fetchRestaurants();
  }, [tripId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestaurant.name.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/api/trips/${tripId}/restaurants`,
        {
          name: newRestaurant.name,
          cuisine: newRestaurant.cuisine,
          price: newRestaurant.price,
          location: {
            address: newRestaurant.address,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRestaurants((prev) => [...prev, res.data]);

      setNewRestaurant({
        name: '',
        address: '',
        cuisine: '',
        price: '',
      });
    } catch (err) {
      console.error('Failed to add restaurant', err);
      setError('Could not add restaurant');
    }
  };

  return (
    <div className="restaurants-container">
       <TripHeader />
      <TripTab />

      <div className="restaurants-header">
        <h1>Restaurants</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="add-restaurant-form">
        <h2>Add a New Restaurant</h2>
        <form onSubmit={handleAddRestaurant}>
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            value={newRestaurant.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newRestaurant.address}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="cuisine"
            placeholder="Cuisine"
            value={newRestaurant.cuisine}
            onChange={handleInputChange}
          />
          <select
            name="price"
            value={newRestaurant.price}
            onChange={handleInputChange}
          >
            <option value="">Select Price</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
            <option value="$$$$">$$$$</option>
          </select>
          <button type="submit">Add Restaurant</button>
        </form>
      </div>

      <div className="restaurants-grid">
        {restaurants.length === 0 ? (
          <p>No restaurants added yet.</p>
        ) : (
          restaurants.map((r, idx) => (
            <div className="restaurant-card" key={r._id || idx}>
              <div className="restaurant-image">
                <span className="cuisine-badge">{r.cuisine}</span>
                <span className="price-badge">{r.priceRange}</span>
              </div>
              <div className="restaurant-content">
                <h3 className="restaurant-name">{r.name}</h3>
                <p className="restaurant-location">{r.location?.address}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Restaurants;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Monuments.css';
import TripTab from '../components/TripTab';
import TripHeader from '../components/TripHeader';

const Monuments = () => {
  const { tripId } = useParams();
  const [monuments, setMonuments] = useState([]);
  const [newMonument, setNewMonument] = useState({
    name: '',
    address: '',
    category: '',
    entryFee: '',
    visitTime: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/trips/${tripId}/monuments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMonuments(res.data);
      } catch (err) {
        console.error('Failed to load monuments', err);
        setError('Failed to fetch monuments');
      }
    };

    fetchMonuments();
  }, [tripId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMonument((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMonument = async (e) => {
    e.preventDefault();
    if (!newMonument.name.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `/api/trips/${tripId}/monuments`,
        newMonument,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMonuments((prev) => [...prev, res.data]);
      setNewMonument({
        name: '',
        address: '',
        category: '',
        entryFee: '',
        visitTime: '',
        description: '',
      });
    } catch (err) {
      console.error('Failed to add monument', err);
      setError('Could not add monument');
    }
  };

  return (
    <div className="monuments-container">
       <TripHeader />
      <TripTab />

      <div className="monuments-header">
        <h1>Monuments</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="add-monument-form">
        <h2>Add a New Monument</h2>
        <form onSubmit={handleAddMonument}>
          <input
            type="text"
            name="name"
            placeholder="Monument Name"
            value={newMonument.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={newMonument.address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g., Landmark)"
            value={newMonument.category}
            onChange={handleChange}
          />
          <input
            type="text"
            name="entryFee"
            placeholder="Entry Fee (e.g., €10)"
            value={newMonument.entryFee}
            onChange={handleChange}
          />
          <input
            type="text"
            name="visitTime"
            placeholder="Best Time to Visit"
            value={newMonument.visitTime}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newMonument.description}
            onChange={handleChange}
            rows={3}
          />
          <button type="submit">Add Monument</button>
        </form>
      </div>

      <div className="monuments-grid">
        {monuments.length === 0 ? (
          <p>No monuments added yet.</p>
        ) : (
          monuments.map((m, idx) => (
            <div className="monument-card" key={m._id || idx}>
              <div className="monument-image">
                <span className="category-badge">{m.category}</span>
                <span className="entry-fee-badge">{m.entryFee}</span>
              </div>
              <div className="monument-content">
                <h3 className="monument-name">{m.name}</h3>
                <p className="monument-location">{m.address}</p>
                <p className="monument-visit-time">{m.visitTime}</p>
                <p className="monument-description">{m.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Monuments;

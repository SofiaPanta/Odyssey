import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TripHeader = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrip(response.data);
      } catch (err) {
        console.error('Error fetching trip for header:', err);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (!trip) return null;

  return (
    <div className="trip-header">
      <h1>{trip.tripName}</h1>
      <div className="trip-dates">
        {trip.arrivalDate && trip.departureDate && (
          `${new Date(trip.arrivalDate).toLocaleDateString()} - ${new Date(trip.departureDate).toLocaleDateString()}`
        )}
      </div>
    </div>
  );
};

export default TripHeader;

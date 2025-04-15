import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import '../assets/styles/TripTab.css';

const TripTab = () => {
  const { tripId } = useParams();

  const tabs = [
    { label: 'Overview', path: `/trips/${tripId}` },
    { label: 'Packing', path: `/trips/${tripId}/packing` },
    { label: 'Map', path: `/trips/${tripId}/map` },
    { label: 'Restaurants', path: `/trips/${tripId}/restaurants` },
    { label: 'Monuments', path: `/trips/${tripId}/monuments` },
    { label: 'Budget', path: `/trips/${tripId}/budget` },
  ];

  return (
    <div className="trip-tab-container">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.path}
          end={tab.path === `/trips/${tripId}`} 
          className={({ isActive }) => (isActive ? 'trip-tab active' : 'trip-tab')}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};

export default TripTab;
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import '../assets/styles/MapView.css';
import TripTab from '../components/TripTab';
import TripHeader from '../components/TripHeader';


const loader = new Loader({
  apiKey: 'AIzaSyBZhrYiHagoB49emJQ_27YR3Fh2HYakX_w', 
  version: 'weekly',
});

const MapView = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    loader.load().then(() => {
      if (mapRef.current) {
        new window.google.maps.Map(mapRef.current, {
          center: { lat: 48.8566, lng: 2.3522 }, // Paris
          zoom: 12,
        });
      }
    });
  }, []);

  return (
    <div className="map-page-container">
       <TripHeader />
      <TripTab />
      <div className="map-layout">
        <aside className="map-sidebar">
          <h3>Search Places</h3>
          <input type="text" placeholder="Search locations..." className="map-search" />

          <h4>Filter by Category</h4>
          <ul className="category-list">
            {['Attraction', 'Restaurant', 'Hotel', 'Shopping', 'Transport'].map((cat) => (
              <li key={cat}>
                <label>
                  <input type="checkbox" /> {cat} <span className="badge">0</span>
                </label>
              </li>
            ))}
          </ul>
        </aside>

        <main className="map-main">
          <div className="map-header">
            <h2>Map</h2>
            <button className="add-location-btn">+ Add Location</button>
          </div>
          <div ref={mapRef} className="map-box" />
        </main>
      </div>
    </div>
  );
};

export default MapView;

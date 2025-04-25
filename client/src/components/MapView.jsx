import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import '../assets/styles/MapView.css';
import TripTab from '../components/TripTab';
import TripHeader from '../components/TripHeader';

const loader = new Loader({
  apiKey: 'AIzaSyBZhrYiHagoB49emJQ_27YR3Fh2HYakX_w',
  version: 'weekly',
  libraries: ['places'],
});

const MapView = () => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    loader.load().then(() => {
      if (mapRef.current) {
        const initialPosition = { lat: 48.8566, lng: 2.3522 }; // Paris

        const map = new window.google.maps.Map(mapRef.current, {
          center: initialPosition,
          zoom: 12,
        });

        mapInstance.current = map;

        const input = inputRef.current;
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ['(cities)'],
        });
        autocomplete.bindTo("bounds", map);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) return;

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13);
          }
        });
      }
    });
  }, []);

  return (
    <div className="map-page-container">
      <TripHeader />
      <TripTab />
      <div className="map-layout">
        <main className="map-main">
          <div className="map-header">
            <input
              type="text"
              ref={inputRef}
              placeholder="Search for a city..."
              className="map-search-bar"
            />
          </div>
          <div ref={mapRef} className="map-box" />
        </main>
      </div>
    </div>
  );
};

export default MapView;

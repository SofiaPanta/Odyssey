import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trip from './pages/Trip';
import Restaurants from './pages/Restaurants';
import Monuments from './pages/Monuments';
import PackingList from './pages/PackingList';
import Budget from './pages/Budget';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import MapView from './components/MapView';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <main className="main-content">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <Routes>
              {/* Redirect root to /home */}
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* Public Routes */}
              <Route path="/home" element={<Landing />} />
              <Route
                path="/login"
                element={<Login setIsAuthenticated={setIsAuthenticated} />}
              />
              <Route
                path="/register"
                element={<Register setIsAuthenticated={setIsAuthenticated} />}
              />

              {/* Private Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trips/:tripId"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Trip />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trips/:tripId/packing"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <PackingList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trips/:tripId/map"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <MapView />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trips/:tripId/restaurants"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Restaurants />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trips/:tripId/monuments"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Monuments />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trips/:tripId/budget"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Budget />
                  </PrivateRoute>
                }
              />
            </Routes>
          )}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

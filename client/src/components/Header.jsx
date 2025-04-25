import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/Header.css';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    // Update authentication state
    setIsAuthenticated(false);

    // Redirect to home
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to={isAuthenticated ? '/dashboard' : '/'}>
            <h1>Odyssey</h1>
          </Link>
        </div>

        <nav className="nav">
          {isAuthenticated ? (
            // Links for authenticated users
            <ul className="nav-links">
              <li>
                <Link to="/dashboard">My Trips</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
              <li className="user-profile">
                <img
                  src="/user-avatar.svg"
                  alt="User Profile"
                  className="avatar"
                />
              </li>
            </ul>
          ) : (
            // Links for non-authenticated users
            <ul className="nav-links">
              <li>
                <Link to="/login" className="login-btn">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="register-btn">
                  Sign Up
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Middleware to authenticate and protect routes
 * Verifies JWT token and adds user info to request
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res
        .status(401)
        .json({ error: 'No authentication token, access denied' });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    // Find user by ID
    const user = await User.findById(decoded.id).select('-password');
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: 'User not found, access denied' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ error: 'Authentication failed: ' + error.message });
  }
};

module.exports = auth;

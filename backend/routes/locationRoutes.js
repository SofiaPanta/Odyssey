const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getLocations,
  addLocation,
  deleteLocation,
} = require('../controllers/locationController');

router.get('/trips/:tripId/locations', auth, getLocations);
router.post('/trips/:tripId/locations', auth, addLocation);
router.delete('/locations/:id', auth, deleteLocation);

module.exports = router;

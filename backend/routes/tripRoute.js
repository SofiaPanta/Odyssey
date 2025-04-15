const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
} = require('../controllers/tripController');

router.route('/')
  .get(auth, getTrips)
  .post(auth, createTrip);

router.route('/:id')
  .get(auth, getTripById)
  .put(auth, updateTrip)
  .delete(auth, deleteTrip);

router.use('/:tripId/packing', auth, require('./packingRoute'));
router.use('/:tripId/budget', auth, require('./budgetRoute'));
router.use('/:tripId/restaurants', auth, require('./restaurantsRoute'));
router.use('/:tripId/monuments', auth, require('./monumentsRoute'));

module.exports = router;

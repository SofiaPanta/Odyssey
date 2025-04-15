const express = require('express');
const {
  addRestaurant,
  getRestaurants,
  updateRestaurant,
  deleteRestaurant,
  toggleVisitStatus
} = require('../controllers/restaurantsController');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(auth, getRestaurants)
  .post(auth, addRestaurant);

router.route('/:id')
  .put(auth, updateRestaurant)
  .delete(auth, deleteRestaurant);

router.put('/:id/toggle-visit', auth, toggleVisitStatus);

module.exports = router;

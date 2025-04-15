const express = require('express');
const {
  createPackingItem,
  getPackingItems,
  updatePackingItem,
  deletePackingItem,
  togglePackingStatus
} = require('../controllers/packingController');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(auth, getPackingItems)
  .post(auth, createPackingItem);

router.route('/:id')
  .put(auth, updatePackingItem)
  .delete(auth, deletePackingItem);

router.put('/:id/toggle', auth, togglePackingStatus);

module.exports = router;

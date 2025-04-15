const express = require('express');
const {
  addMonument,
  getMonuments,
  updateMonument,
  deleteMonument,
  toggleVisitStatus
} = require('../controllers/monumentsController');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(auth, getMonuments)
  .post(auth, addMonument);

router.route('/:id')
  .put(auth, updateMonument)
  .delete(auth, deleteMonument);

router.put('/:id/toggle-visit', auth, toggleVisitStatus);

module.exports = router;

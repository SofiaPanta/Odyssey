const express = require('express');
const {
  addBudgetEntry,
  getBudgetEntries,
  updateBudgetEntry,
  deleteBudgetEntry,
} = require('../controllers/budgetController');
const auth = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(auth, getBudgetEntries).post(auth, addBudgetEntry);

router
  .route('/:id')
  .put(auth, updateBudgetEntry)
  .delete(auth, deleteBudgetEntry);

router.get('/trips/:tripId', auth, getBudgetEntries);

module.exports = router;

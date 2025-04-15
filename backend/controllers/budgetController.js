const Budget = require('../models/budgetModel');
const Trip = require('../models/tripModel');

// Create budget entry
const addBudgetEntry = async (req, res) => {
  try {
    const { name, category, amount } = req.body;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const entry = await Budget.create({ tripId, name, category, amount });
    res.status(201).json(entry);
  } catch (err) {
    console.error('Add budget entry error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all budget entries for a trip
const getBudgetEntries = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const entries = await Budget.find({ tripId }).sort('-createdAt');
    res.json(entries);
  } catch (err) {
    console.error('Get budget entries error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update budget entry
const updateBudgetEntry = async (req, res) => {
  try {
    const entry = await Budget.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    const trip = await Trip.findById(entry.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const fields = ['name', 'category', 'amount'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        entry[field] = req.body[field];
      }
    });

    const updated = await entry.save();
    res.json(updated);
  } catch (err) {
    console.error('Update budget entry error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete budget entry
const deleteBudgetEntry = async (req, res) => {
  try {
    const entry = await Budget.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });

    const trip = await Trip.findById(entry.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await entry.deleteOne();
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    console.error('Delete budget entry error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addBudgetEntry,
  getBudgetEntries,
  updateBudgetEntry,
  deleteBudgetEntry
};

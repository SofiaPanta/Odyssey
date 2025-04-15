const PackingItem = require('../models/packingModel');
const Trip = require('../models/tripModel');

// Add a packing item
const createPackingItem = async (req, res) => {
  try {
    const { name, category } = req.body;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    const newItem = await PackingItem.create({
      tripId,
      name,
      category,
      isPacked: false
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Create packing item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all packing items for a trip
const getPackingItems = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    const items = await PackingItem.find({ tripId }).sort('category');
    res.json(items);
  } catch (error) {
    console.error('Get packing items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle packed status
const togglePackingStatus = async (req, res) => {
  try {
    const item = await PackingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Packing item not found' });

    const trip = await Trip.findById(item.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    item.isPacked = !item.isPacked;
    const updated = await item.save();

    res.json(updated);
  } catch (error) {
    console.error('Toggle packing status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update packing item
const updatePackingItem = async (req, res) => {
  try {
    const { name, category } = req.body;
    const item = await PackingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Packing item not found' });

    const trip = await Trip.findById(item.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    if (name !== undefined) item.name = name;
    if (category !== undefined) item.category = category;

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    console.error('Update packing item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete packing item
const deletePackingItem = async (req, res) => {
  try {
    const item = await PackingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Packing item not found' });

    const trip = await Trip.findById(item.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    await item.deleteOne();
    res.json({ message: 'Packing item removed' });
  } catch (error) {
    console.error('Delete packing item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPackingItem,
  getPackingItems,
  togglePackingStatus,
  updatePackingItem,
  deletePackingItem
};

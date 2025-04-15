const Monument = require('../models/monumentsModel');
const Trip = require('../models/tripModel');

// Add a monument
const addMonument = async (req, res) => {
  try {
    const { name, address, description, category, visitTime, entryFee } = req.body;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const monument = await Monument.create({
      tripId,
      name,
      address,
      description,
      category,
      visitTime,
      entryFee,
      visited: false
    });

    res.status(201).json(monument);
  } catch (error) {
    console.error('Add monument error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get monuments
const getMonuments = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const monuments = await Monument.find({ tripId }).sort('name');
    res.json(monuments);
  } catch (error) {
    console.error('Get monuments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update monument
const updateMonument = async (req, res) => {
  try {
    const monument = await Monument.findById(req.params.id);
    if (!monument) return res.status(404).json({ message: 'Monument not found' });

    const trip = await Trip.findById(monument.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const fields = ['name', 'address', 'description', 'category', 'visitTime', 'entryFee', 'visited'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        monument[field] = req.body[field];
      }
    });

    const updated = await monument.save();
    res.json(updated);
  } catch (error) {
    console.error('Update monument error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete monument
const deleteMonument = async (req, res) => {
  try {
    const monument = await Monument.findById(req.params.id);
    if (!monument) return res.status(404).json({ message: 'Monument not found' });

    const trip = await Trip.findById(monument.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await monument.deleteOne();
    res.json({ message: 'Monument removed' });
  } catch (error) {
    console.error('Delete monument error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle visited
const toggleVisitStatus = async (req, res) => {
  try {
    const monument = await Monument.findById(req.params.id);
    if (!monument) return res.status(404).json({ message: 'Monument not found' });

    const trip = await Trip.findById(monument.tripId);
    if (!trip || trip.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    monument.visited = !monument.visited;
    const updated = await monument.save();

    res.json(updated);
  } catch (error) {
    console.error('Toggle visit status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addMonument,
  getMonuments,
  updateMonument,
  deleteMonument,
  toggleVisitStatus
};

const Trip = require('../models/tripModel');

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const { tripName, arrivalDate, departureDate } = req.body;

    if (!tripName || !arrivalDate || !departureDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const newTrip = new Trip({
      userId: req.user._id,
      tripName,
      arrivalDate: new Date(arrivalDate),
      departureDate: new Date(departureDate),
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error while creating trip' });
  }
};

// Get all trips for the logged-in user
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort('-createdAt');
    res.status(200).json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error while fetching trips' });
  }
};

// Get a single trip by ID
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({ message: 'Server error while getting trip' });
  }
};

// Update a trip
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { tripName, arrivalDate, departureDate } = req.body;

    trip.tripName = tripName || trip.tripName;
    trip.arrivalDate = arrivalDate || trip.arrivalDate;
    trip.departureDate = departureDate || trip.departureDate;

    const updatedTrip = await trip.save();
    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Server error while updating trip' });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await trip.deleteOne();
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error while deleting trip' });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};

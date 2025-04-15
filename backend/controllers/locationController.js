const Location = require('../models/locationModel');
const Trip = require('../models/tripModel');

const getLocations = async (req, res) => {
  const { tripId } = req.params;
  const locations = await Location.find({ tripId });
  res.json(locations);
};

const addLocation = async (req, res) => {
  const { tripId } = req.params;
  const { name, category, coordinates, address, notes } = req.body;
  const location = await Location.create({ tripId, name, category, coordinates, address, notes });
  res.status(201).json(location);
};

const deleteLocation = async (req, res) => {
  await Location.findByIdAndDelete(req.params.id);
  res.json({ message: 'Location deleted' });
};

module.exports = { getLocations, addLocation, deleteLocation };

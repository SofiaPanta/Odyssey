const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  name: String,
  category: {
    type: String,
    enum: ['Attraction', 'Restaurant', 'Hotel', 'Shopping', 'Transport', 'Other'],
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  address: String,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);

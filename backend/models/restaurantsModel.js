const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      address: {
        type: String,
        trim: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    cuisine: {
      type: String,
      trim: true,
    },
    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },
    visited: {
      type: Boolean,
      default: false,
    },
    website: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for optimized lookups by trip
restaurantSchema.index({ tripId: 1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;

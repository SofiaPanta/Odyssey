const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  transportation: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster queries by user
tripSchema.index({ userId: 1 });

// Virtual populate to get attractions
tripSchema.virtual('attractions', {
  ref: 'Attraction',
  localField: '_id',
  foreignField: 'tripId'
});

// Virtual populate to get packing items
tripSchema.virtual('packingItems', {
  ref: 'PackingItem',
  localField: '_id',
  foreignField: 'tripId'
});

// Virtual populate to get budget items
tripSchema.virtual('budgetEntries', {
  ref: 'Budget',
  localField: '_id',
  foreignField: 'tripId'
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
const mongoose = require('mongoose');

const monumentSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  visitTime: {
    type: String,
    trim: true
  },
  entryFee: {
    type: String,
    trim: true
  },
  visited: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index for fast lookups
monumentSchema.index({ tripId: 1 });

const Monument = mongoose.model('Monument', monumentSchema);

module.exports = Monument;

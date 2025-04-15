const mongoose = require('mongoose');

const packingItemSchema = new mongoose.Schema(
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
    category: {
      type: String,
      trim: true,
      default: 'Miscellaneous',
    },
    isPacked: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

packingItemSchema.index({ tripId: 1 });

const PackingItem = mongoose.model('PackingItem', packingItemSchema);

module.exports = PackingItem;

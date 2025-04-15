const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

budgetSchema.index({ tripId: 1 });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;

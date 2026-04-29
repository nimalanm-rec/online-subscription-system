const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide plan name'],
    enum: ['Basic', 'Premium', 'Pro'],
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide plan price'],
    min: 0
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in days'],
    default: 30
  },
  features: [{
    type: String,
    required: true
  }],
  maxUsers: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;

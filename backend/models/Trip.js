const mongoose = require('mongoose');
const { generateTripCode } = require('../utils/tripCode');

const tripSchema = new mongoose.Schema({
  tripCode: {
    type: String,
    required: true,
    unique: true
  },
  cargoOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CargoOwner',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  cargoType: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  estimatedDuration: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'DELAYED', 'CANCELLED'],
    default: 'PENDING'
  },
  pickupTime: {
    type: Date,
    default: null
  },
  deliveryTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

tripSchema.pre('validate', function (next) {
  if (!this.tripCode || typeof this.tripCode !== 'string' || this.tripCode.trim() === '') {
    this.tripCode = generateTripCode();
  }
  next();
});

module.exports = mongoose.model('Trip', tripSchema);

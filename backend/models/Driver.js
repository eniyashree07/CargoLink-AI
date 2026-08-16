const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  drivingLicence: {
    type: String,
    default: ''
  },
  truckNumber: {
    type: String,
    default: ''
  },
  vehicleType: {
    type: String,
    default: 'Mini Truck'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'ON_TRIP', 'UNAVAILABLE'],
    default: 'AVAILABLE'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);

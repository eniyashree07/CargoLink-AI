const mongoose = require('mongoose');

const liveLocationSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    unique: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  speed: {
    type: Number,
    default: 0
  },
  heading: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    default: 'browser-gps'
  }
}, {
  timestamps: true
});

liveLocationSchema.index({ updatedAt: 1 });

module.exports = mongoose.model('LiveLocation', liveLocationSchema);

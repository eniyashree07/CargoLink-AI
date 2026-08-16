const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const CargoOwner = require('../models/CargoOwner');
const auth = require('../middleware/auth');
const { generateTripCode, isValidTripCode } = require('../utils/tripCode');

const tripPopulate = [
  { path: 'cargoOwnerId' },
  { path: 'driverId', populate: { path: 'userId', select: 'fullName email mobile' } }
];

function isDuplicateKeyError(error) {
  return error && error.code === 11000;
}

function toDuplicateKeyMessage() {
  return 'Unable to create load due to a unique code conflict. Please try again.';
}

// Get Trips by Cargo Owner
router.get('/owner/:cargoOwnerId', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ cargoOwnerId: req.params.cargoOwnerId }).populate(tripPopulate);
    res.json({
      success: true,
      trips
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get Trips by Driver
router.get('/driver/:driverId', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ driverId: req.params.driverId }).populate(tripPopulate);
    res.json({
      success: true,
      trips
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get All Trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find().populate(tripPopulate);
    res.json({
      success: true,
      trips
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get Trip by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate(tripPopulate);
    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found' 
      });
    }
    res.json({
      success: true,
      trip
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Create Trip
router.post('/', auth, async (req, res) => {
  const MAX_RETRIES = 3;
  try {
    const tripData = { ...req.body };

    // Resolve the cargo owner from the authenticated user's token so the trip
    // always stores the real CargoOwner profile id (the client may send the
    // User id or nothing — either way the server resolves the correct owner).
    if (req.user && req.user.userId) {
      const owner = await CargoOwner.findOne({ userId: req.user.userId });
      if (owner) tripData.cargoOwnerId = owner._id;
    }

    // Always generate a fresh tripCode on the backend so the frontend never
    // needs to supply one (unique: true on the schema prevents null duplicates).
    tripData.tripCode = isValidTripCode(tripData.tripCode) ? tripData.tripCode : generateTripCode();

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        tripData.tripCode = generateTripCode();
      }

      try {
        const trip = new Trip(tripData);
        if (!isValidTripCode(trip.tripCode)) {
          trip.tripCode = generateTripCode();
        }
        await trip.save();
        return res.status(201).json({
          success: true,
          message: 'Load created successfully',
          tripCode: trip.tripCode,
          trip
        });
      } catch (saveError) {
        if (isDuplicateKeyError(saveError)) {
          if (attempt < MAX_RETRIES) {
            console.warn(`Duplicate tripCode "${tripData.tripCode}" detected, retrying with a new code (attempt ${attempt + 1}/${MAX_RETRIES})`);
            continue;
          }
          return res.status(409).json({
            success: false,
            message: toDuplicateKeyMessage()
          });
        }
        throw saveError;
      }
    }

    return res.status(409).json({
      success: false,
      message: toDuplicateKeyMessage()
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        success: false,
        message: toDuplicateKeyMessage()
      });
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create load'
    });
  }
});

// Update Trip
router.put('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found' 
      });
    }
    res.json({
      success: true,
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete Trip
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found' 
      });
    }
    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Assign Driver to Trip
router.patch('/:id/assign-driver', auth, async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: 'Driver ID is required'
      });
    }
    
    // Check if driver is available (case-insensitive)
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver not found' 
      });
    }
    if ((driver.status || '').toUpperCase() !== 'AVAILABLE') {
      return res.status(400).json({ 
        success: false, 
        message: `Driver is not available (current status: ${driver.status})` 
      });
    }

    // Check if trip exists
    const existingTrip = await Trip.findById(req.params.id);
    if (!existingTrip) {
      return res.status(404).json({ 
        success: false, 
        message: 'Trip not found' 
      });
    }

    // Update trip
    await Trip.findByIdAndUpdate(
      req.params.id,
      { driverId, status: 'ASSIGNED' },
      { new: true }
    );

    // Update driver status
    await Driver.findByIdAndUpdate(driverId, { status: 'ON_TRIP' });

    // Fetch updated trip with populated data
    const updatedTrip = await Trip.findById(req.params.id)
      .populate(tripPopulate);

    res.json({
      success: true,
      message: 'Driver assigned successfully',
      trip: updatedTrip
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update Trip Status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // If trip is delivered, update driver status to available
    if (status === 'DELIVERED' && trip.driverId) {
      await Driver.findByIdAndUpdate(trip.driverId, { status: 'AVAILABLE' });
    }

    res.json({
      success: true,
      message: 'Trip status updated successfully',
      trip
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const auth = require('../middleware/auth');

const tripPopulate = [
  { path: 'cargoOwnerId' },
  { path: 'driverId', populate: { path: 'userId', select: 'fullName email mobile' } }
];

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
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
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

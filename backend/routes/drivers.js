const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get All Drivers
router.get('/', auth, async (req, res) => {
  try {
    const drivers = await Driver.find().populate('userId', 'fullName email mobile');
    res.json({
      success: true,
      drivers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get Available Drivers
router.get('/available', auth, async (req, res) => {
  try {
    const drivers = await Driver.find({ status: 'AVAILABLE' }).populate('userId', 'fullName email mobile');
    res.json({
      success: true,
      drivers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get Driver by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('userId', 'fullName email mobile');
    if (!driver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver not found' 
      });
    }
    res.json({
      success: true,
      driver
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get Driver by User ID
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.params.userId }).populate('userId', 'fullName email mobile');
    if (!driver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver not found' 
      });
    }
    res.json({
      success: true,
      driver
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Create Driver
router.post('/', auth, async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      driver
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Update Driver
router.put('/:id', auth, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver not found' 
      });
    }
    res.json({
      success: true,
      message: 'Driver updated successfully',
      driver
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Delete Driver
router.delete('/:id', auth, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ 
        success: false, 
        message: 'Driver not found' 
      });
    }
    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;

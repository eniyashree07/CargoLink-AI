const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get Dashboard Data
router.get('/me', auth, async (req, res) => {
  try {
    const { role, userId } = req.user;
    let dashboardData = {};

    if (role === 'OWNER') {
      const trips = await Trip.find();
      const drivers = await Driver.find();
      
      dashboardData = {
        totalTrips: trips.length,
        activeTrips: trips.filter(t => t.status === 'IN_TRANSIT').length,
        pendingTrips: trips.filter(t => t.status === 'PENDING').length,
        completedTrips: trips.filter(t => t.status === 'DELIVERED').length,
        delayedTrips: trips.filter(t => t.status === 'DELAYED').length,
        totalDrivers: drivers.length,
        availableDrivers: drivers.filter(d => d.status === 'AVAILABLE').length
      };
    } else if (role === 'DRIVER') {
      const driver = await Driver.findOne({ userId }).populate('userId', 'fullName email mobile');
      const trips = driver ? await Trip.find({ driverId: driver._id }) : [];
      const notifications = await Notification.find({ userId, read: false });

      dashboardData = {
        totalTrips: trips.length,
        activeTrips: trips.filter(t => t.status === 'IN_TRANSIT').length,
        completedTrips: trips.filter(t => t.status === 'DELIVERED').length,
        pendingTrips: trips.filter(t => t.status === 'PENDING').length,
        unreadNotifications: notifications.length,
        driverProfile: driver ? {
          id: driver._id,
          fullName: driver.userId?.fullName,
          email: driver.userId?.email,
          mobile: driver.userId?.mobile,
          drivingLicence: driver.drivingLicence,
          truckNumber: driver.truckNumber,
          vehicleType: driver.vehicleType,
          rating: driver.rating,
          status: driver.status
        } : null
      };
    } else if (role === 'ADMIN') {
      const trips = await Trip.find();
      const drivers = await Driver.find();
      
      dashboardData = {
        totalTrips: trips.length,
        totalDrivers: drivers.length,
        activeTrips: trips.filter(t => t.status === 'IN_TRANSIT').length
      };
    }

    res.json({
      success: true,
      ...dashboardData
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get Owner Dashboard
router.get('/owner', auth, async (req, res) => {
  try {
    const trips = await Trip.find();
    const drivers = await Driver.find();
    const notifications = await Notification.find({ userId: req.user.userId, read: false });

    res.json({
      success: true,
      totalTrips: trips.length,
      activeTrips: trips.filter(t => t.status === 'IN_TRANSIT').length,
      pendingTrips: trips.filter(t => t.status === 'PENDING').length,
      completedTrips: trips.filter(t => t.status === 'DELIVERED').length,
      delayedTrips: trips.filter(t => t.status === 'DELAYED').length,
      totalDrivers: drivers.length,
      availableDrivers: drivers.filter(d => d.status === 'AVAILABLE').length,
      unreadNotifications: notifications.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get Driver Dashboard
router.get('/driver', auth, async (req, res) => {
  try {
    const driver = await Driver.findOne({ userId: req.user.userId });
    const trips = driver ? await Trip.find({ driverId: driver._id }) : [];
    const notifications = await Notification.find({ userId: req.user.userId, read: false });

    res.json({
      success: true,
      totalTrips: trips.length,
      activeTrips: trips.filter(t => t.status === 'IN_TRANSIT').length,
      completedTrips: trips.filter(t => t.status === 'DELIVERED').length,
      pendingTrips: trips.filter(t => t.status === 'PENDING').length,
      unreadNotifications: notifications.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;

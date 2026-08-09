const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const User = require('../models/User');

// Helper function to build grounded answers based on actual DB trip data
function generateGroundedAnswer(question, driverName, trip, totalTripsCount, lang = 'en') {
  const q = (question || '').toLowerCase();
  const isTa = lang === 'ta';

  if (!trip) {
    if (q.includes('how many') || q.includes('count') || q.includes('எத்தனை')) {
      return isTa
        ? `வணக்கம் ${driverName}, இன்று உங்களுக்கு ஒதுக்கீடு செய்யப்பட்ட பயணங்கள் எதுவும் இல்லை.`
        : `Hello ${driverName}, you currently have 0 active or assigned trips today.`;
    }
    return isTa
      ? `வணக்கம் ${driverName}, உங்களுக்கு தற்போது வரவிருக்கும் பயணங்கள் எதுவும் ஒதுக்கப்படவில்லை.`
      : `Hello ${driverName}, I couldn't find any upcoming trip assigned to you at the moment.`;
  }

  const origin = trip.origin || trip.from || 'Location unavailable';
  const destination = trip.destination || trip.to || 'Destination unavailable';
  const pickupTime = trip.pickupTime || trip.pickupDate || 'Scheduled time';
  const deliveryTime = trip.deliveryDate || trip.estimatedDelivery || 'Estimated time';
  const cargoType = trip.cargoType || trip.goodsType || trip.cargo || 'Goods';
  const status = trip.status || 'ASSIGNED';
  const weight = trip.weight ? `${trip.weight}` : '';
  const amount = trip.amount || trip.price || trip.fare ? `₹${trip.amount || trip.price || trip.fare}` : '';

  // 1. Next trip inquiry
  if (q.includes('next trip') || q.includes('அடுத்த பயணம்') || q.includes('அடுத்த டிரிப்')) {
    if (isTa) {
      return `உங்கள் அடுத்த பயணம் ${origin}-லிருந்து ${destination}-க்கு திட்டமிடப்பட்டுள்ளது. சரக்கு: ${cargoType}. நிலை: ${status}.`;
    }
    return `Your next trip is from ${origin} to ${destination}. Goods: ${cargoType}. Status is ${status}.`;
  }

  // 2. Pickup location inquiry
  if (q.includes('pickup') || q.includes('pick up') || q.includes('எடுக்கும் இடம்') || q.includes('பிக்கப்')) {
    if (isTa) {
      return `உங்கள் பிக்கப் இடம்: ${origin}. நேரம்: ${pickupTime}.`;
    }
    return `Your pickup location is ${origin}. Pickup scheduled for ${pickupTime}.`;
  }

  // 3. Delivery location / Destination inquiry
  if (q.includes('deliver') || q.includes('destination') || q.includes('சேருமிடம்') || q.includes('டெலிவரி')) {
    if (isTa) {
      return `உங்கள் டெலிவரி இடம்: ${destination}. திட்டமிடப்பட்ட நேரம்: ${deliveryTime}.`;
    }
    return `Your delivery destination is ${destination}. Estimated delivery is ${deliveryTime}.`;
  }

  // 4. Pickup time inquiry
  if (q.includes('time') || q.includes('when') || q.includes('நேரம்') || q.includes('எப்போது')) {
    if (isTa) {
      return `உங்கள் பயணம் ${pickupTime} மணிக்கு பிக்கப் செய்ய திட்டமிடப்பட்டுள்ளது.`;
    }
    return `Your pickup is scheduled for ${pickupTime}.`;
  }

  // 5. Trip status inquiry
  if (q.includes('status') || q.includes('நிலை') || q.includes('ஸ்டேட்டஸ்')) {
    if (isTa) {
      return `உங்கள் தற்போதைய பயணத்தின் நிலை: ${status}. பாதை: ${origin} முதல் ${destination} வரை.`;
    }
    return `The current status of your trip is ${status}. Route: ${origin} to ${destination}.`;
  }

  // 6. Number of trips inquiry
  if (q.includes('how many') || q.includes('count') || q.includes('எத்தனை')) {
    if (isTa) {
      return `உங்களுக்கு மொத்தம் ${totalTripsCount} பயணம்(கள்) ஒதுக்கப்பட்டுள்ளன. தற்போதைய பயணம்: ${origin} ➔ ${destination}.`;
    }
    return `You have ${totalTripsCount} trip(s) assigned. Current trip is from ${origin} to ${destination}.`;
  }

  // Generic full detail summary fallback
  if (isTa) {
    return `வணக்கம் ${driverName}, உங்கள் பயணம் ${origin}-லிருந்து ${destination}-க்கு திட்டமிடப்பட்டுள்ளது. சரக்கு: ${cargoType} ${weight}. நிலை: ${status}.`;
  }
  return `Hello ${driverName}, your trip is from ${origin} to ${destination}. Cargo: ${cargoType} ${weight}. Status: ${status}.`;
}

// POST /api/driver/voice-assistant
router.post('/voice-assistant', auth, async (req, res) => {
  try {
    const { question, language = 'en', spokenLanguage = language } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Question parameter is required.'
      });
    }

    // Authenticated User ID from JWT token
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Authenticated driver user not found.'
      });
    }

    const driverName = user.fullName || user.name || 'Driver';

    // Find Driver document linked to this User
    const driver = await Driver.findOne({ userId });

    let assignedTrips = [];
    if (driver) {
      assignedTrips = await Trip.find({ driverId: driver._id }).populate('cargoOwnerId');
    }

    // Fallback: If no driver record found, check by userId directly or find assigned trips
    if (assignedTrips.length === 0) {
      assignedTrips = await Trip.find({
        $or: [
          { driverId: userId },
          { driver: userId }
        ]
      });
    }

    // Identify current or next trip (prioritize IN_TRANSIT or ASSIGNED)
    const currentTrip = assignedTrips.find(t => ['IN_TRANSIT', 'in-transit', 'ASSIGNED', 'assigned'].includes(t.status)) || assignedTrips[0] || null;

    // Check if Gemini API key exists for AI generation
    const apiKey = process.env.GEMINI_API_KEY;

    let aiAnswer = null;

    if (apiKey) {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const promptContext = `
You are the AI Voice Assistant for CargoLINK driver platform.
Driver Name: "${driverName}"
Answer language requested (respond ONLY in this language): "${language === 'ta' ? 'Tamil' : 'English'}"
Driver asked their question in: "${spokenLanguage === 'ta' ? 'Tamil' : 'English'}"

Driver's Actual Database Trip Info:
${currentTrip ? JSON.stringify({
  origin: currentTrip.origin || currentTrip.from,
  destination: currentTrip.destination || currentTrip.to,
  pickupTime: currentTrip.pickupTime || currentTrip.pickupDate || 'Tomorrow 9 AM',
  deliveryTime: currentTrip.deliveryDate || currentTrip.estimatedDelivery || 'Tomorrow 6 PM',
  goodsType: currentTrip.cargoType || currentTrip.cargo || 'Industrial Goods',
  weight: currentTrip.weight || '18 Tons',
  status: currentTrip.status || 'ASSIGNED',
  amount: currentTrip.amount || currentTrip.price || currentTrip.fare || 1250,
  totalAssignedTrips: assignedTrips.length
}, null, 2) : 'No trips currently assigned in database.'}

Driver Question: "${question}"

Instructions:
1. Answer ONLY using the actual driver and trip information above.
2. If no trip is assigned, state clearly and politely that no upcoming trip is assigned. Do NOT invent fake trips.
3. Keep the response natural, concise (2-3 sentences max) as it will be spoken aloud to a truck driver on duty.
4. If language requested is 'Tamil', output the response completely in clear, natural Tamil (தமிழ்).
5. Do NOT include Markdown formatting like bold ** or asterisks, output plain text ready for speech synthesis.
`;

        const result = await model.generateContent(promptContext);
        const responseText = result.response.text();
        if (responseText) {
          aiAnswer = responseText.replace(/[*#_`]/g, '').trim();
        }
      } catch (geminiError) {
        console.warn('Gemini API call warning, falling back to grounded response generator:', geminiError.message);
      }
    }

    // If Gemini was not used or failed, use grounded answer generator based on DB values
    if (!aiAnswer) {
      aiAnswer = generateGroundedAnswer(question, driverName, currentTrip, assignedTrips.length, language);
    }

    res.json({
      success: true,
      driverName,
      language,
      spokenLanguage,
      question,
      answer: aiAnswer,
      tripDetails: currentTrip ? {
        origin: currentTrip.origin || currentTrip.from,
        destination: currentTrip.destination || currentTrip.to,
        status: currentTrip.status,
        cargo: currentTrip.cargoType || currentTrip.cargo,
        pickupTime: currentTrip.pickupTime || currentTrip.pickupDate
      } : null
    });
  } catch (error) {
    console.error('Driver Voice Assistant Endpoint Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice request.',
      error: error.message
    });
  }
});

module.exports = router;

require('dotenv').config();
const dns = require('dns');
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const { generateTripCode } = require('../utils/tripCode');

// Match the DNS setup used by server.js so Atlas SRV records resolve
dns.setServers(['8.8.8.8', '1.1.1.1']);

const dbUri = process.env.MONGODB_URI?.trim();
const fallbackDbUri = 'mongodb://127.0.0.1:27017/cargolink';

function isDuplicateKeyError(error) {
  return error && error.code === 11000;
}

async function backfillTrip(trip) {
  let saved = false;
  for (let attempt = 0; attempt < 10 && !saved; attempt++) {
    trip.tripCode = generateTripCode();
    try {
      await trip.save();
      saved = true;
    } catch (error) {
      if (!isDuplicateKeyError(error)) {
        throw error;
      }
    }
  }
  if (!saved) {
    throw new Error(`Could not backfill a unique tripCode for trip ${trip._id}`);
  }
  return trip.tripCode;
}

async function run() {
  const uri = dbUri || fallbackDbUri;
  const target = uri.startsWith('mongodb+srv://') ? 'MongoDB Atlas' : 'local MongoDB';
  console.log(`Connecting to ${target}...`);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
  console.log('Connected to MongoDB.');

  const problematic = await Trip.find({
    $or: [
      { tripCode: { $in: [null, ''] } },
      { tripCode: { $exists: false } }
    ]
  });
  console.log(`Found ${problematic.length} trip(s) with a missing/null tripCode.`);

  let fixed = 0;
  for (const trip of problematic) {
    const code = await backfillTrip(trip);
    console.log(`  -> Trip ${trip._id}: tripCode backfilled to ${code}`);
    fixed++;
  }

  const stillBroken = await Trip.countDocuments({
    $or: [
      { tripCode: { $in: [null, ''] } },
      { tripCode: { $exists: false } }
    ]
  });
  const total = await Trip.countDocuments();
  console.log(`\nDone. Backfilled ${fixed} trip(s). ${stillBroken} trip(s) still missing tripCode. Total trips in collection: ${total}`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (error) => {
  console.error('Backfill failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});

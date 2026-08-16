const crypto = require('crypto');

function generateTripCode() {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TRIP-${timestamp}-${random}`;
}

function isValidTripCode(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

module.exports = { generateTripCode, isValidTripCode };

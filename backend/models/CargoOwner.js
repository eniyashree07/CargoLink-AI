const mongoose = require('mongoose');

const cargoOwnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  gstNumber: {
    type: String,
    required: true
  },
  companyAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CargoOwner', cargoOwnerSchema);

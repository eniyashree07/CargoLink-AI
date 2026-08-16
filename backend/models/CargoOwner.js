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
    default: ''
  },
  gstNumber: {
    type: String,
    default: ''
  },
  companyAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CargoOwner', cargoOwnerSchema);

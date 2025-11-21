const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

const Response = mongoose.model('Response', ResponseSchema);

module.exports = Response;
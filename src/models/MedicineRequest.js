const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

const MedicineRequestSchema = new mongoose.Schema({
  consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consumer' },
  medicineName: { type: String, required: true },
  imageURL: { type: String },
  notes: { type: String },
  location: { lat: Number, lng: Number },
  sentToSellers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }],
  responses: [ResponseSchema]
}, { timestamps: true });

const MedicineRequest = mongoose.model('MedicineRequest', MedicineRequestSchema);

module.exports = MedicineRequest;
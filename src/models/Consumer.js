const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ConsumerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  location: { lat: Number, lng: Number }
}, { timestamps: true });

ConsumerSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

ConsumerSchema.methods.matchPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Consumer', ConsumerSchema);
const express = require('express');
const { Seller } = require('../models/Seller');
const { protectSeller } = require('../middleware/auth');

const router = express.Router();

// Seller registration
router.post('/register', async (req, res) => {
  try {
    const { storeName, email, password, phone, lat, lng } = req.body;
    if (!storeName || !email || !password) {
      return res.status(400).json({ message: 'storeName, email, password required' });
    }
    const seller = new Seller({
      storeName,
      email,
      password,
      phone,
      location: { lat: lat !== undefined ? Number(lat) : undefined, lng: lng !== undefined ? Number(lng) : undefined }
    });
    await seller.save();
    return res.json({ token: seller.generateAuthToken() });
  } catch (e) {
    const msg = e && e.code === 11000 ? 'Email already registered' : (e.message || 'Register error');
    return res.status(400).json({ message: msg });
  }
});

// Seller login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email, password required' });
    }
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const match = await seller.matchPassword(password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    return res.json({ token: seller.generateAuthToken() });
  } catch (e) {
    return res.status(400).json({ message: e.message || 'Login error' });
  }
});

// Get requests assigned to seller
router.get('/requests', protectSeller, async (req, res) => {
  try {
    const requests = await MedicineRequest.find({ sentToSellers: req.seller._id })
      .populate('consumerId', 'name email location');
    return res.json(requests);
  } catch (e) {
    return res.status(400).json({ message: e.message || 'Error' });
  }
});

// Respond to a request
router.post('/respond', protectSeller, async (req, res) => {
  try {
    const { requestId, status } = req.body;
    if (!requestId || !status) {
      return res.status(400).json({ message: 'requestId, status required' });
    }
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const request = await MedicineRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    const response = request.responses.find(r => String(r.sellerId) === String(req.seller._id));
    if (!response) {
      return res.status(400).json({ message: 'Not assigned to this seller' });
    }
    response.status = status;
    response.timestamp = new Date();
    await request.save();
    return res.json({ message: 'Response recorded' });
  } catch (e) {
    return res.status(400).json({ message: e.message || 'Error' });
  }
});

module.exports = router;
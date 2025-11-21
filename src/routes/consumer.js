const express = require('express');
const { Consumer } = require('../models/Consumer');
const { MedicineRequest } = require('../models/MedicineRequest');
const { protectConsumer } = require('../middleware/auth');
const router = express.Router();

// Register a new consumer
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, lat, lng } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const consumer = new Consumer({
      name,
      email,
      password,
      phone,
      location: { lat, lng }
    });
    await consumer.save();
    return res.status(201).json({ message: 'Consumer registered successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Login a consumer
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const consumer = await Consumer.findOne({ email });
    if (!consumer || !(await consumer.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = consumer.generateAuthToken();
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Create a medicine request
router.post('/request', protectConsumer, async (req, res) => {
  try {
    const { medicineName, notes, lat, lng } = req.body;
    const request = new MedicineRequest({
      consumerId: req.consumer._id,
      medicineName,
      notes,
      location: { lat, lng }
    });
    await request.save();
    return res.status(201).json({ message: 'Request created successfully.', requestId: request._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get consumer's requests
router.get('/requests', protectConsumer, async (req, res) => {
  try {
    const requests = await MedicineRequest.find({ consumerId: req.consumer._id });
    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
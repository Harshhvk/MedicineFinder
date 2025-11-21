require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// parse JSON and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- config ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nearest_medicine';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev';
const PORT = Number(process.env.PORT) || 4000;
const NEARBY_KM = Number(process.env.NEARBY_KM) || 5;

// ensure uploads folder
const UPLOADS_DIR = path.join(__dirname, 'uploads');
try { if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR); } catch (err) { console.error('Unable to create uploads dir', err); }

// serve uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// --- mongoose ---
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

// --- routes ---
const consumerRoutes = require('./routes/consumer');
const sellerRoutes = require('./routes/seller');
const uploadRoutes = require('./routes/upload');

app.use('/api/consumer', consumerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/upload', uploadRoutes);

// health check
app.get('/health', (req, res) => res.json({ ok: true }));

// start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// export app for tests
module.exports = app;
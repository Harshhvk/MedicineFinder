const jwt = require('jsonwebtoken');
const { Consumer, Seller } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev';

function extractBearerToken(header) {
  if (!header || typeof header !== 'string') return null;
  const parts = header.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return null;
}

async function protectConsumer(req, res, next) {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' });
    const consumer = await Consumer.findById(decoded.id).select('-password');
    if (!consumer) return res.status(401).json({ message: 'No consumer' });
    req.consumer = consumer;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Auth error' });
  }
}

async function protectSeller(req, res, next) {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) return res.status(401).json({ message: 'Invalid token' });
    const seller = await Seller.findById(decoded.id).select('-password');
    if (!seller) return res.status(401).json({ message: 'No seller' });
    req.seller = seller;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Auth error' });
  }
}

module.exports = {
  protectConsumer,
  protectSeller,
};
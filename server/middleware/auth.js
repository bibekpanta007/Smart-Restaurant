const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const createError = require('../utils/createError');

// checks the token and puts the logged-in user on req.user
async function protect(req, res, next) {
  const header = req.headers.authorization || '';

  // token is sent as "Bearer <token>"
  if (!header.startsWith('Bearer ')) {
    throw createError(401, 'Please log in to continue.');
  }
  const token = header.split(' ')[1];

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createError(401, 'Your session has expired or is invalid. Please log in again.');
  }

  // the account might have been deleted after the token was made
  const user = await User.findById(payload.id);
  if (!user) throw createError(401, 'This account no longer exists.');

  req.user = user;
  next();
}

// use after protect
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    throw createError(403, 'Only admins can do this.');
  }
  next();
}

module.exports = { protect, requireAdmin };
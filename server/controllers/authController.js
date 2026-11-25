const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const createError = require('../utils/createError');
const createToken = require('../utils/createToken');
const { isValidEmail, validateNewUser } = require('../utils/validation');

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password, phone } = req.body;
  validateNewUser({ name, email, password, phone });

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findByEmail(normalizedEmail);
  if (existing) throw createError(409, 'An account with this email already exists.');

  const passwordHash = await bcrypt.hash(password, 10);

  // new accounts are always customers
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone,
    passwordHash,
  });

  res.status(201).json({ message: 'Account created.', token: createToken(user), user });
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;
  if (!isValidEmail(email) || typeof password !== 'string') {
    throw createError(400, 'Email and password are required.');
  }

  const user = await User.findByEmail(email.trim().toLowerCase());

  // same message for wrong email or wrong password
  const passwordMatches = user && (await bcrypt.compare(password, user.password_hash));
  if (!passwordMatches) throw createError(401, 'Invalid email or password.');

  const safeUser = await User.findById(user.id);
  res.json({ message: 'Logged in.', token: createToken(safeUser), user: safeUser });
}

module.exports = { register, login };
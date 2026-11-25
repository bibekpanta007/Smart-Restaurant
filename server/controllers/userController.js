const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const createError = require('../utils/createError');
const {
  isNonEmptyString,
  isValidEmail,
  isValidPhone,
  validateNewUser,
} = require('../utils/validation');

const ROLES = ['customer', 'admin'];

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw createError(400, 'Invalid user id.');
  return id;
}

// customers can only access their own account
function checkAccess(req, id) {
  if (req.user.role !== 'admin' && req.user.id !== id) {
    throw createError(403, 'You can only access your own account.');
  }
}

// GET /api/users (admin)
async function getUsers(req, res) {
  const users = await User.findAll();
  res.json({ count: users.length, users });
}

// GET /api/users/:id
async function getUser(req, res) {
  const id = parseId(req.params.id);
  checkAccess(req, id);

  const user = await User.findById(id);
  if (!user) throw createError(404, 'User not found.');

  res.json({ user });
}

// POST /api/users (admin)
async function createUser(req, res) {
  const { name, email, password, phone, role = 'customer' } = req.body;
  validateNewUser({ name, email, password, phone });
  if (!ROLES.includes(role)) throw createError(400, 'Role must be customer or admin.');

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findByEmail(normalizedEmail)) {
    throw createError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone,
    passwordHash,
    role,
  });

  res.status(201).json({ message: 'User created.', user });
}

// PUT /api/users/:id – only the fields that are sent get updated
async function updateUser(req, res) {
  const id = parseId(req.params.id);
  checkAccess(req, id);

  const existing = await User.findById(id);
  if (!existing) throw createError(404, 'User not found.');

  const { name, email, phone, password, role } = req.body;
  const fields = {};

  if (name !== undefined) {
    if (!isNonEmptyString(name)) throw createError(400, 'Name cannot be empty.');
    fields.name = name.trim();
  }

  if (email !== undefined) {
    if (!isValidEmail(email)) throw createError(400, 'Please provide a valid email.');
    const normalizedEmail = email.trim().toLowerCase();
    const other = await User.findByEmail(normalizedEmail);
    if (other && other.id !== id) throw createError(409, 'This email is already in use.');
    fields.email = normalizedEmail;
  }

  if (phone !== undefined) {
    if (phone && !isValidPhone(phone)) throw createError(400, 'Phone number must have 10 digits.');
    fields.phone = phone || null;
  }

  if (password !== undefined) {
    if (typeof password !== 'string' || password.length < 6) {
      throw createError(400, 'Password must be at least 6 characters.');
    }
    fields.password_hash = await bcrypt.hash(password, 10);
  }

  if (role !== undefined) {
    if (req.user.role !== 'admin') throw createError(403, 'Only admins can change roles.');
    if (!ROLES.includes(role)) throw createError(400, 'Role must be customer or admin.');
    if (id === req.user.id && role !== 'admin') {
      throw createError(400, "You can't remove your own admin role.");
    }
    fields.role = role;
  }

  const user = await User.update(id, fields);
  res.json({ message: 'User updated.', user });
}

// DELETE /api/users/:id (admin)
async function deleteUser(req, res) {
  const id = parseId(req.params.id);
  if (id === req.user.id) {
    throw createError(400, "You can't delete your own account while logged in.");
  }

  const deleted = await User.remove(id);
  if (!deleted) throw createError(404, 'User not found.');

  res.json({ message: 'User deleted.' });
}

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
const createError = require('./createError');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function isValidEmail(email) {
  return typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
}

function isValidPhone(phone) {
  return typeof phone === 'string' && phone.replace(/\D/g, '').length === 10;
}

// checks the fields needed to create an account
function validateNewUser({ name, email, password, phone }) {
  if (!isNonEmptyString(name)) throw createError(400, 'Name is required.');
  if (!isValidEmail(email)) throw createError(400, 'Please provide a valid email.');
  if (typeof password !== 'string' || password.length < 6) {
    throw createError(400, 'Password must be at least 6 characters.');
  }
  if (phone && !isValidPhone(phone)) throw createError(400, 'Phone number must have 10 digits.');
}

module.exports = { isNonEmptyString, isValidEmail, isValidPhone, validateNewUser };
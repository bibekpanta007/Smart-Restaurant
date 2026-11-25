const pool = require('../config/db');

// never select password_hash here, so it is never sent back
const SAFE_COLUMNS = 'id, name, email, phone, role, created_at, updated_at';

// includes password_hash, only used for login
async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${SAFE_COLUMNS} FROM users WHERE id = ?`, [id]);
  return rows[0];
}

async function findAll() {
  const [rows] = await pool.query(`SELECT ${SAFE_COLUMNS} FROM users ORDER BY created_at DESC`);
  return rows;
}

async function create({ name, email, phone, passwordHash, role = 'customer' }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || null, passwordHash, role]
  );
  return findById(result.insertId);
}

// fields only ever contains column names set in our controller
async function update(id, fields) {
  const columns = Object.keys(fields);
  if (columns.length === 0) return findById(id);

  const setClause = columns.map((column) => `${column} = ?`).join(', ');
  const values = columns.map((column) => fields[column]);

  await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findByEmail, findById, findAll, create, update, remove };
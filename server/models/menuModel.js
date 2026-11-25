const pool = require('../config/db');

// MySQL sends DECIMAL as text and BOOLEAN as 0/1, so convert them
function format(row) {
  return {
    ...row,
    price: Number(row.price),
    available: Boolean(row.available),
    is_special: Boolean(row.is_special),
    ingredients: row.ingredients || [],
    dietary: row.dietary || [],
  };
}

async function findAll({ category, dietary, search, maxPrice } = {}) {
  const conditions = [];
  const values = [];

  if (category) {
    conditions.push('category = ?');
    values.push(category);
  }
  if (dietary) {
    // checks if the dietary list contains this tag, e.g. "Vegan"
    conditions.push('JSON_CONTAINS(dietary, ?)');
    values.push(JSON.stringify(dietary));
  }
  if (search) {
    conditions.push('(name LIKE ? OR description LIKE ?)');
    values.push(`%${search}%`, `%${search}%`);
  }
  if (maxPrice) {
    conditions.push('price <= ?');
    values.push(maxPrice);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT * FROM menu_items ${where}
     ORDER BY FIELD(category, 'Starters', 'Mains', 'Desserts', 'Beverages'), id`,
    values
  );
  return rows.map(format);
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
  return rows[0] ? format(rows[0]) : undefined;
}

async function findSpecial() {
  const [rows] = await pool.query('SELECT * FROM menu_items WHERE is_special = TRUE LIMIT 1');
  return rows[0] ? format(rows[0]) : null;
}

async function create(item) {
  const [result] = await pool.query(
    `INSERT INTO menu_items
      (name, category, description, ingredients, price, dietary, image, available)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.name,
      item.category,
      item.description,
      JSON.stringify(item.ingredients),
      item.price,
      JSON.stringify(item.dietary),
      item.image || null,
      item.available,
    ]
  );
  return findById(result.insertId);
}

// fields only ever contains column names set in our controller
async function update(id, fields) {
  const columns = Object.keys(fields);
  if (columns.length === 0) return findById(id);

  const setClause = columns.map((column) => `${column} = ?`).join(', ');
  const values = columns.map((column) => fields[column]);

  await pool.query(`UPDATE menu_items SET ${setClause} WHERE id = ?`, [...values, id]);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// makes this item the only special (all others become false)
async function setSpecial(id) {
  await pool.query('UPDATE menu_items SET is_special = (id = ?)', [id]);
  return findById(id);
}

module.exports = { findAll, findById, findSpecial, create, update, remove, setSpecial };
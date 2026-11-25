const Menu = require('../models/menuModel');
const createError = require('../utils/createError');
const { isNonEmptyString } = require('../utils/validation');

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Beverages'];
const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free'];

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw createError(400, 'Invalid menu item id.');
  return id;
}

// new item: checks every field; update (isUpdate = true): only checks the fields that were sent
function validateMenuItem(body, isUpdate = false) {
  const { name, category, description, ingredients, price, dietary, image, available } = body;
  const fields = {};

  if (!isUpdate || name !== undefined) {
    if (!isNonEmptyString(name)) throw createError(400, 'Name is required.');
    fields.name = name.trim();
  }

  if (!isUpdate || category !== undefined) {
    if (!CATEGORIES.includes(category)) {
      throw createError(400, `Category must be one of: ${CATEGORIES.join(', ')}.`);
    }
    fields.category = category;
  }

  if (!isUpdate || description !== undefined) {
    if (!isNonEmptyString(description)) throw createError(400, 'Description is required.');
    fields.description = description.trim();
  }

  if (!isUpdate || price !== undefined) {
    const number = Number(price);
    if (typeof price === 'boolean' || !Number.isFinite(number) || number <= 0) {
      throw createError(400, 'Price must be a number greater than 0.');
    }
    fields.price = Math.round(number * 100) / 100;
  }

  if (ingredients !== undefined) {
    if (!Array.isArray(ingredients) || !ingredients.every(isNonEmptyString)) {
      throw createError(400, 'Ingredients must be a list of text values.');
    }
    fields.ingredients = ingredients.map((i) => i.trim());
  } else if (!isUpdate) {
    fields.ingredients = [];
  }

  if (dietary !== undefined) {
    if (!Array.isArray(dietary) || !dietary.every((d) => DIETARY_OPTIONS.includes(d))) {
      throw createError(400, `Dietary tags must be from: ${DIETARY_OPTIONS.join(', ')}.`);
    }
    fields.dietary = dietary;
  } else if (!isUpdate) {
    fields.dietary = [];
  }

  if (image !== undefined) {
    if (image !== null && typeof image !== 'string') throw createError(400, 'Image must be text.');
    fields.image = image ? image.trim() : null;
  }

  if (available !== undefined) {
    if (typeof available !== 'boolean') throw createError(400, 'Available must be true or false.');
    fields.available = available;
  } else if (!isUpdate) {
    fields.available = true;
  }

  return fields;
}

// GET /api/menu?category=Mains&dietary=Vegan&search=pasta&maxPrice=15
async function getMenu(req, res) {
  const { category, dietary, search, maxPrice } = req.query;

  if (category && !CATEGORIES.includes(category)) throw createError(400, 'Unknown category.');
  if (dietary && !DIETARY_OPTIONS.includes(dietary)) throw createError(400, 'Unknown dietary tag.');
  if (maxPrice !== undefined && !(Number(maxPrice) > 0)) {
    throw createError(400, 'maxPrice must be a number greater than 0.');
  }

  const items = await Menu.findAll({
    category,
    dietary,
    search: search ? search.trim() : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  res.json({ count: items.length, items });
}

// GET /api/menu/special
async function getSpecial(req, res) {
  const special = await Menu.findSpecial();
  res.json({ special });
}

// GET /api/menu/:id
async function getMenuItem(req, res) {
  const item = await Menu.findById(parseId(req.params.id));
  if (!item) throw createError(404, 'Menu item not found.');
  res.json({ item });
}

// POST /api/menu (admin)
async function createMenuItem(req, res) {
  const fields = validateMenuItem(req.body);
  const item = await Menu.create(fields);
  res.status(201).json({ message: 'Menu item created.', item });
}

// PUT /api/menu/:id (admin)
async function updateMenuItem(req, res) {
  const id = parseId(req.params.id);
  const existing = await Menu.findById(id);
  if (!existing) throw createError(404, 'Menu item not found.');

  const fields = validateMenuItem(req.body, true);

  // JSON columns are saved as text
  if (fields.ingredients) fields.ingredients = JSON.stringify(fields.ingredients);
  if (fields.dietary) fields.dietary = JSON.stringify(fields.dietary);

  const item = await Menu.update(id, fields);
  res.json({ message: 'Menu item updated.', item });
}

// DELETE /api/menu/:id (admin)
async function deleteMenuItem(req, res) {
  const deleted = await Menu.remove(parseId(req.params.id));
  if (!deleted) throw createError(404, 'Menu item not found.');
  res.json({ message: 'Menu item deleted.' });
}

// PATCH /api/menu/:id/special (admin)
async function setSpecial(req, res) {
  const id = parseId(req.params.id);
  const existing = await Menu.findById(id);
  if (!existing) throw createError(404, 'Menu item not found.');
  if (!existing.available) throw createError(400, 'An unavailable item cannot be the special.');

  const item = await Menu.setSpecial(id);
  res.json({ message: `${item.name} is now today's special.`, item });
}

module.exports = {
  getMenu,
  getSpecial,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setSpecial,
};
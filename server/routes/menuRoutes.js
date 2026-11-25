const express = require('express');
const {
  getMenu,
  getSpecial,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setSpecial,
} = require('../controllers/menuController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// anyone can view the menu
router.get('/', getMenu);
router.get('/special', getSpecial); // must come before /:id
router.get('/:id', getMenuItem);

// admin only
router.post('/', protect, requireAdmin, createMenuItem);
router.put('/:id', protect, requireAdmin, updateMenuItem);
router.delete('/:id', protect, requireAdmin, deleteMenuItem);
router.patch('/:id/special', protect, requireAdmin, setSpecial);

module.exports = router;
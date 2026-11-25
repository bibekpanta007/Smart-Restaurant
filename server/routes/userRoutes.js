const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// all user routes need a logged-in user
router.use(protect);

router.get('/', requireAdmin, getUsers);
router.post('/', requireAdmin, createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', requireAdmin, deleteUser);

module.exports = router;
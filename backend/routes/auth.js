const express = require('express');
const { registerUser, loginUser, getCurrentUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);

module.exports = router;

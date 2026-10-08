const express              = require('express');
const router               = express.Router();

const { registerAdopter, loginAdopter, getProfile } = require('../controllers/adopterController');
const { authenticate }     = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerAdopter);
router.post('/login',    loginAdopter);

// Protected routes (requires valid JWT)
router.get('/me', authenticate, getProfile);

module.exports = router;


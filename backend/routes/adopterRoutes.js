<<<<<<< HEAD
const express = require('express');
const router  = express.Router();

const { registerAdopter } = require('../controllers/adopterController');

// POST /api/adopters/register
router.post('/register', registerAdopter);
=======
const express              = require('express');
const router               = express.Router();

const { registerAdopter, loginAdopter, getProfile } = require('../controllers/adopterController');
const { authenticate }     = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerAdopter);
router.post('/login',    loginAdopter);

// Protected routes (requires valid JWT)
router.get('/me', authenticate, getProfile);
>>>>>>> 89a08b39002c2d7cb17377dbe4df0c4b3d4f7944

module.exports = router;


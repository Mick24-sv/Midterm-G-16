const express = require('express');
const router  = express.Router();

const { registerAdopter, loginAdopter } = require('../controllers/adopterController');

// POST /api/adopters/register
router.post('/register', registerAdopter);

// POST /api/adopters/login
router.post('/login', loginAdopter);

module.exports = router;


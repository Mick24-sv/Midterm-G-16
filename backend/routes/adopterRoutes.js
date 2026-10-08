const express = require('express');
const router  = express.Router();

const { registerAdopter } = require('../controllers/adopterController');

// POST /api/adopters/register
router.post('/register', registerAdopter);

module.exports = router;


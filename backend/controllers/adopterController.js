const { Adopter } = require('../models/Adopter');

// POST /api/adopters/register
const registerAdopter = (req, res) => {
  const { first_name, last_name, email, phone, address } = req.body;

  // Basic validation
  if (!first_name || !last_name || !email || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: first_name, last_name, email, phone, address.',
    });
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format.',
    });
  }

  Adopter.create({ first_name, last_name, email, phone, address }, (err, adopter) => {
    if (err) {
      // Handle duplicate email
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({
          success: false,
          message: 'Email is already registered.',
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Adopter registered successfully.',
      data: adopter,
    });
  });
};

module.exports = { registerAdopter };


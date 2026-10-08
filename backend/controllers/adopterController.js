<<<<<<< HEAD
<<<<<<< HEAD
const { Adopter } = require('../models/Adopter');

// POST /api/adopters/register
const registerAdopter = (req, res) => {
  const { first_name, last_name, email, phone, address } = req.body;

  // Basic validation
  if (!first_name || !last_name || !email || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: first_name, last_name, email, phone, address.',
=======
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const { Adopter }   = require('../models/Adopter');

const JWT_SECRET    = process.env.JWT_SECRET || 'pet_adoption_secret_key';
const SALT_ROUNDS   = 10;
=======
const { Adopter } = require('../models/Adopter');
>>>>>>> e73d0f5009619758fc733e3b2fda96d21d523e50

// POST /api/adopters/register
const registerAdopter = (req, res) => {
  const { first_name, last_name, email, phone, address } = req.body;

  // Basic validation
  if (!first_name || !last_name || !email || !phone || !address) {
    return res.status(400).json({
      success: false,
<<<<<<< HEAD
      message: 'All fields are required: first_name, last_name, email, phone, address, password.',
>>>>>>> 89a08b39002c2d7cb17377dbe4df0c4b3d4f7944
=======
      message: 'All fields are required: first_name, last_name, email, phone, address.',
>>>>>>> e73d0f5009619758fc733e3b2fda96d21d523e50
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e73d0f5009619758fc733e3b2fda96d21d523e50
  Adopter.create({ first_name, last_name, email, phone, address }, (err, adopter) => {
    if (err) {
      // Handle duplicate email
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({
          success: false,
          message: 'Email is already registered.',
<<<<<<< HEAD
        });
      }
=======
  // Password length check
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters.',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    Adopter.create(
      { first_name, last_name, email, phone, address, password: hashedPassword },
      (err, adopter) => {
        if (err) {
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

        // Exclude password from response
        const { password: _, ...adopterData } = adopter;

        return res.status(201).json({
          success: true,
          message: 'Adopter registered successfully.',
          data: adopterData,
        });
      }
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: err.message,
    });
  }
};

// POST /api/adopters/login
const loginAdopter = (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  Adopter.getByEmail(email, async (err, adopter) => {
    if (err) {
>>>>>>> 89a08b39002c2d7cb17377dbe4df0c4b3d4f7944
=======
        });
      }
>>>>>>> e73d0f5009619758fc733e3b2fda96d21d523e50
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

<<<<<<< HEAD
<<<<<<< HEAD
    return res.status(201).json({
      success: true,
      message: 'Adopter registered successfully.',
      data: adopter,
=======
    if (!adopter) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, adopter.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: adopter.id, email: adopter.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Exclude password from response
    const { password: _, ...adopterData } = adopter;

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: adopterData,
>>>>>>> 89a08b39002c2d7cb17377dbe4df0c4b3d4f7944
=======
    return res.status(201).json({
      success: true,
      message: 'Adopter registered successfully.',
      data: adopter,
>>>>>>> e73d0f5009619758fc733e3b2fda96d21d523e50
    });
  });
};

<<<<<<< HEAD
<<<<<<< HEAD
module.exports = { registerAdopter };

=======
// GET /api/adopters/me  (protected)
const getProfile = (req, res) => {
  const { id, email } = req.adopter;

  Adopter.getById(id, (err, adopter) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    if (!adopter) {
      return res.status(404).json({
        success: false,
        message: 'Adopter not found.',
      });
    }

    const { password: _, ...adopterData } = adopter;

    return res.status(200).json({
      success: true,
      data: adopterData,
    });
  });
};

module.exports = { registerAdopter, loginAdopter, getProfile };
>>>>>>> 89a08b39002c2d7cb17377dbe4df0c4b3d4f7944
=======
module.exports = { registerAdopter };

>>>>>>> e73d0f5009619758fc733e3b2fda96d21d523e50

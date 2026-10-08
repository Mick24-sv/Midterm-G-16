const express = require('express');
const router = express.Router();
const { Pet } = require('../models/Pet');

// GET /api/pets - Get all pets
router.get('/', (req, res) => {
  Pet.getAll((err, pets) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(pets);
  });
});

// GET /api/pets/:id - Get a single pet by ID
router.get('/:id', (req, res) => {
  Pet.getById(req.params.id, (err, pet) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    res.json(pet);
  });
});

module.exports = router;


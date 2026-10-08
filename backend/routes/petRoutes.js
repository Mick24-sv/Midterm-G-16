const express = require('express');
const router = express.Router();
const { Pet } = require('../models/Pet');

// GET /api/pets - Get all pets (supports ?name=, ?species=, ?breed= filters)
router.get('/', (req, res) => {
  const { name, species, breed } = req.query;
  const hasFilter = name || species || breed;

  const handler = (err, pets) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(pets);
  };

  if (hasFilter) {
    Pet.search({ name, species, breed }, handler);
  } else {
    Pet.getAll(handler);
  }
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

// PATCH /api/pets/:id/status - Update adoption status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'status is required' });
  }
  Pet.updateStatus(req.params.id, status, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    if (result.changes === 0) return res.status(404).json({ error: 'Pet not found' });
    res.json({ message: 'Status updated successfully' });
  });
});

module.exports = router;


const express = require('express');
const router  = express.Router();

const {
  createAdoptionRequest,
  getAllAdoptions,
  getAdoptionById,
  getAdoptionsByAdopter,
  getAdoptionsByPet,
  getAdoptionsByStatus,
  updateAdoption,
  deleteAdoption,
} = require('../controllers/adoptionController');

// Submit an adoption request
router.post('/', createAdoptionRequest);
router.post('/request', createAdoptionRequest);

// Get all adoption requests (supports optional ?status=&adopter_id=&pet_id=)
router.get('/', getAllAdoptions);

// Get adoption requests by status, adopter, or pet
router.get('/status/:status', getAdoptionsByStatus);
router.get('/adopter/:adopterId', getAdoptionsByAdopter);
router.get('/pet/:petId', getAdoptionsByPet);

// Get single adoption request by ID
router.get('/:id', getAdoptionById);

// Update an adoption request
router.put('/:id', updateAdoption);
router.patch('/:id', updateAdoption);

// Delete an adoption request
router.delete('/:id', deleteAdoption);

module.exports = router;


const { Adoption } = require('../models/Adoption');
const { Pet }      = require('../models/Pet');

// POST /api/adoptions or /api/adoptions/request
const createAdoptionRequest = (req, res) => {
  const { pet_id, adopter_id, notes, adoption_date } = req.body;

  // Basic validation
  if (!pet_id || !adopter_id) {
    return res.status(400).json({
      success: false,
      message: 'Both pet_id and adopter_id are required.',
    });
  }

  // Check pet exists and is available before creating adoption
  Pet.getById(pet_id, (err, pet) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found.',
      });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Pet is not available for adoption. Current status: ${pet.status}.`,
      });
    }

    const adoptionData = {
      pet_id,
      adopter_id,
      status: 'pending',
      notes: notes || null,
      adoption_date: adoption_date || null,
    };

    Adoption.create(adoptionData, (createErr, adoption) => {
      if (createErr) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error.',
          error: createErr.message,
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Adoption request submitted successfully.',
        data: adoption,
      });
    });
  });
};

// GET /api/adoptions
const getAllAdoptions = (req, res) => {
  const { status, adopter_id, pet_id } = req.query;

  const handleResponse = (err, adoptions) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: adoptions,
    });
  };

  if (status || adopter_id || pet_id) {
    Adoption.filter({ status, adopter_id, pet_id }, handleResponse);
  } else {
    Adoption.getAll(handleResponse);
  }
};

// GET /api/adoptions/:id
const getAdoptionById = (req, res) => {
  const { id } = req.params;

  Adoption.getById(id, (err, adoption) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    if (!adoption) {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: adoption,
    });
  });
};

// GET /api/adoptions/adopter/:adopterId
const getAdoptionsByAdopter = (req, res) => {
  const { adopterId } = req.params;

  Adoption.getByAdopterId(adopterId, (err, adoptions) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: adoptions,
    });
  });
};

// GET /api/adoptions/pet/:petId
const getAdoptionsByPet = (req, res) => {
  const { petId } = req.params;

  Adoption.getByPetId(petId, (err, adoptions) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: adoptions,
    });
  });
};

// GET /api/adoptions/status/:status
const getAdoptionsByStatus = (req, res) => {
  const { status } = req.params;

  Adoption.getByStatus(status, (err, adoptions) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: adoptions,
    });
  });
};

// PUT /api/adoptions/:id
const updateAdoption = (req, res) => {
  const { id } = req.params;
  const { status, notes, adoption_date, pet_id, adopter_id } = req.body;

  Adoption.getById(id, (err, existing) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found.',
      });
    }

    Adoption.update(id, { status, notes, adoption_date, pet_id, adopter_id }, (updateErr) => {
      if (updateErr) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error.',
          error: updateErr.message,
        });
      }

      Adoption.getById(id, (fetchErr, updatedAdoption) => {
        if (fetchErr) {
          return res.status(200).json({
            success: true,
            message: 'Adoption request updated successfully.',
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Adoption request updated successfully.',
          data: updatedAdoption,
        });
      });
    });
  });
};

// DELETE /api/adoptions/:id
const deleteAdoption = (req, res) => {
  const { id } = req.params;

  Adoption.getById(id, (err, existing) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found.',
      });
    }

    Adoption.delete(id, (deleteErr) => {
      if (deleteErr) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error.',
          error: deleteErr.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Adoption request deleted successfully.',
      });
    });
  });
};

// PUT / PATCH / POST /api/adoptions/:id/cancel
const cancelAdoptionRequest = (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};

  Adoption.getById(id, (err, adoption) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: err.message,
      });
    }

    if (!adoption) {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found.',
      });
    }

    if (adoption.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Adoption request is already cancelled.',
      });
    }

    if (adoption.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an approved adoption request.',
      });
    }

    const updatedNotes = reason
      ? (adoption.notes ? `${adoption.notes} | Cancelled: ${reason}` : `Cancelled: ${reason}`)
      : adoption.notes;

    Adoption.update(id, { status: 'cancelled', notes: updatedNotes }, (updateErr) => {
      if (updateErr) {
        return res.status(500).json({
          success: false,
          message: 'Internal server error.',
          error: updateErr.message,
        });
      }

      Adoption.getById(id, (fetchErr, updatedAdoption) => {
        return res.status(200).json({
          success: true,
          message: 'Adoption request cancelled successfully.',
          data: updatedAdoption || { ...adoption, status: 'cancelled', notes: updatedNotes },
        });
      });
    });
  });
};

module.exports = {
  createAdoptionRequest,
  getAllAdoptions,
  getAdoptionById,
  getAdoptionsByAdopter,
  getAdoptionsByPet,
  getAdoptionsByStatus,
  updateAdoption,
  deleteAdoption,
  cancelAdoptionRequest,
};


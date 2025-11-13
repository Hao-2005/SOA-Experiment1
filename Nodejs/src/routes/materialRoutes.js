

const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// GET /materials/available - Get available materials
router.get('/available', materialController.getAvailableMaterials);

// PUT /materials/:id/quantity - Update material quantity
// IMPORTANT: This must come before /:id route to avoid route matching conflict
router.put('/:id/quantity', materialController.updateMaterialQuantity);

// PUT /materials/:id - Update material
router.put('/:id', materialController.updateMaterial);

// DELETE /materials/:id - Delete material
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;


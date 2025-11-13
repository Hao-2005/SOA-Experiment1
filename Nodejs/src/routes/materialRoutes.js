

const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// IMPORTANT: Order matters! Put specific routes before dynamic parameter routes

// GET /materials/available - Get available materials (MUST come before /:id)
router.get('/available', materialController.getAvailableMaterials);

// PUT /materials/:id/quantity - Update material quantity (MUST come before /:id)
router.put('/:id/quantity', materialController.updateMaterialQuantity);

// GET /materials - Get all materials
router.get('/', materialController.getAllMaterials);

// GET /materials/:id - Get material by ID
router.get('/:id', materialController.getMaterialById);

// POST /materials - Create new material
router.post('/', materialController.createMaterial);

// PUT /materials/:id - Update material
router.put('/:id', materialController.updateMaterial);

// DELETE /materials/:id - Delete material
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;


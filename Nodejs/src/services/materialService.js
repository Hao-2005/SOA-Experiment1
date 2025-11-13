/**
 * Material business logic service
 */

const db = require('../config/database');
const { toMaterialDto, toMaterialDtoList } = require('../models/Material');
const constants = require('../config/constants');

/**
 * Get all materials
 * @returns {Promise<Array>} Array of material DTOs
 */
const getAllMaterials = async () => {
  const materials = await db.getAllMaterials();
  return toMaterialDtoList(materials);
};

/**
 * Get available materials (status=available and available_quantity > 0)
 * @returns {Promise<Array>} Array of available material DTOs
 */
const getAvailableMaterials = async () => {
  const allMaterials = await getAllMaterials();
  return allMaterials.filter(
    (material) => material.status === 'available' && material.available_quantity > 0
  );
};

/**
 * Get material by ID
 * @param {number|string} id - Material ID
 * @returns {Promise<Object|null>} Material DTO or null if not found
 */
const getMaterialById = async (id) => {
  const material = await db.getMaterialById(id);
  return toMaterialDto(material);
};

/**
 * Create a new material
 * @param {Object} payload - Material data
 * @returns {Promise<Object>} Created material DTO
 */
const createMaterial = async (payload) => {
  const timestamp = new Date().toISOString();

  const material = {
    material_code: payload.material_code,
    name: payload.name,
    category: payload.category,
    total_quantity: Number(payload.total_quantity),
    available_quantity: Number(payload.available_quantity),
    location: payload.location,
    status: payload.status || constants.DEFAULT_STATUS,
    description: payload.description || null,
    purchase_date: payload.purchase_date || null,
    unit_price: Number(payload.unit_price),
    created_at: timestamp,
    updated_at: timestamp
  };

  const created = await db.createMaterial(material);
  return toMaterialDto(created);
};

/**
 * Update an existing material
 * @param {number|string} id - Material ID
 * @param {Object} payload - Fields to update
 * @returns {Promise<Object|null>} Updated material DTO or null if not found
 */
const updateMaterial = async (id, payload) => {
  const updates = {
    ...payload,
    total_quantity: payload.total_quantity !== undefined ? Number(payload.total_quantity) : undefined,
    available_quantity:
      payload.available_quantity !== undefined ? Number(payload.available_quantity) : undefined,
    unit_price: payload.unit_price !== undefined ? Number(payload.unit_price) : undefined,
    updated_at: new Date().toISOString()
  };

  // Remove undefined fields
  Object.keys(updates).forEach((key) => {
    if (updates[key] === undefined) {
      delete updates[key];
    }
  });

  const updated = await db.updateMaterial(id, updates);
  return toMaterialDto(updated);
};

/**
 * Delete a material
 * @param {number|string} id - Material ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
const deleteMaterial = async (id) => {
  return await db.deleteMaterial(id);
};

/**
 * Update material quantity (borrow/return)
 * @param {number|string} id - Material ID
 * @param {string} operation - Operation type ('borrow' or 'return')
 * @param {number} quantity - Quantity to borrow/return
 * @returns {Promise<Object>} { error: string|null, material: Object|null }
 */
const updateMaterialQuantity = async (id, operation, quantity) => {
  const existing = await db.getMaterialById(id);
  if (!existing) {
    return { error: '物资不存在', material: null };
  }

  const qty = Number(quantity);

  if (operation === 'borrow') {
    if (existing.available_quantity < qty) {
      return { error: '可用数量不足', material: null };
    }
    existing.available_quantity -= qty;
  } else if (operation === 'return') {
    const newAvailable = existing.available_quantity + qty;
    if (newAvailable > existing.total_quantity) {
      return { error: '归还数量超出总数量限制', material: null };
    }
    existing.available_quantity = newAvailable;
  }

  existing.updated_at = new Date().toISOString();
  await db.updateMaterial(id, {
    available_quantity: existing.available_quantity,
    updated_at: existing.updated_at
  });

  return {
    error: null,
    material: {
      id: existing.id,
      available_quantity: existing.available_quantity,
      total_quantity: existing.total_quantity
    }
  };
};

/**
 * Check if material code exists
 * @param {string} materialCode - Material code to check
 * @param {number|null} excludeId - ID to exclude from check
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
const materialCodeExists = async (materialCode, excludeId = null) => {
  return await db.materialCodeExists(materialCode, excludeId);
};

module.exports = {
  getAllMaterials,
  getAvailableMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  updateMaterialQuantity,
  materialCodeExists
};

/**
 * Material data model and DTO transformations
 */

/**
 * Convert material entity to DTO
 * @param {Object} material - Material entity
 * @returns {Object} Material DTO
 */
const toMaterialDto = (material) => {
  if (!material) {
    return null;
  }

  return {
    id: material.id,
    material_code: material.material_code,
    name: material.name,
    category: material.category,
    total_quantity: material.total_quantity,
    available_quantity: material.available_quantity,
    location: material.location,
    status: material.status,
    description: material.description ?? null,
    purchase_date: material.purchase_date ?? null,
    unit_price: material.unit_price,
    created_at: material.created_at,
    updated_at: material.updated_at
  };
};

/**
 * Convert array of materials to DTOs
 * @param {Array} materials - Array of material entities
 * @returns {Array} Array of material DTOs
 */
const toMaterialDtoList = (materials) => {
  return materials.map(toMaterialDto);
};

module.exports = {
  toMaterialDto,
  toMaterialDtoList
};


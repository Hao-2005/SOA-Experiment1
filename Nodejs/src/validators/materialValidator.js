/**
 * Material validation utilities
 */

const constants = require('../config/constants');

/**
 * Validate material payload
 * @param {Object} payload - Material data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Array} Array of error messages (empty if valid)
 */
const validateMaterialPayload = (payload, isUpdate = false) => {
  const errors = [];

  // Required fields validation for create operations
  if (!isUpdate) {
    constants.REQUIRED_FIELDS.forEach((field) => {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        errors.push(`字段 '${field}' 为必填项`);
      }
    });
  }

  // Non-empty string fields validation
  const nonEmptyFields = ['material_code', 'name', 'category', 'location', 'status'];
  nonEmptyFields.forEach((field) => {
    if (payload[field] !== undefined && payload[field] !== null && `${payload[field]}`.trim() === '') {
      errors.push(`字段 '${field}' 不能为空`);
    }
  });

  // Category validation
  if (payload.category && !constants.VALID_CATEGORIES.includes(payload.category)) {
    errors.push(`字段 'category' 仅支持: ${constants.VALID_CATEGORIES.join(', ')}`);
  }

  // Status validation
  if (payload.status && !constants.VALID_STATUS.includes(payload.status)) {
    errors.push(`字段 'status' 仅支持: ${constants.VALID_STATUS.join(', ')}`);
  }

  // Numeric fields validation
  const numericFields = ['total_quantity', 'available_quantity', 'unit_price'];
  numericFields.forEach((field) => {
    if (payload[field] !== undefined) {
      const value = Number(payload[field]);
      if (Number.isNaN(value)) {
        errors.push(`字段 '${field}' 需要为数字类型`);
      } else if ((field === 'total_quantity' || field === 'available_quantity') && value < 0) {
        errors.push(`字段 '${field}' 不能为负数`);
      } else if (field === 'unit_price' && value < 0) {
        errors.push(`字段 '${field}' 不能为负数`);
      }
    }
  });

  // Quantity relationship validation
  const total = payload.total_quantity ?? null;
  const available = payload.available_quantity ?? null;
  if (total !== null && available !== null && Number(available) > Number(total)) {
    errors.push('available_quantity 不能大于 total_quantity');
  }

  return errors;
};

/**
 * Validate quantity update operation
 * @param {string} operation - Operation type (borrow/return)
 * @param {*} quantity - Quantity value
 * @returns {Object} { valid: boolean, error: string|null }
 */
const validateQuantityOperation = (operation, quantity) => {
  if (!operation || !constants.QUANTITY_OPERATIONS.includes(operation.toLowerCase())) {
    return {
      valid: false,
      error: `operation 仅支持: ${constants.QUANTITY_OPERATIONS.join(', ')}`
    };
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty <= 0) {
    return {
      valid: false,
      error: 'quantity 需要为正整数'
    };
  }

  return { valid: true, error: null };
};

module.exports = {
  validateMaterialPayload,
  validateQuantityOperation
};


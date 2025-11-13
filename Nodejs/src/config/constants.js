/**
 * Application constants and configuration values
 */

module.exports = {
  REQUIRED_FIELDS: [
    'material_code',
    'name',
    'category',
    'total_quantity',
    'available_quantity',
    'location'
  ],

  DEFAULT_STATUS: 'available',

  VALID_CATEGORIES: ['equipment', 'consumable', 'book'],

  VALID_STATUS: ['available', 'maintenance', 'scrapped'],

  QUANTITY_OPERATIONS: ['borrow', 'return'],

  PORT: process.env.PORT || 8082
};


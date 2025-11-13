/**
 * MySQL database access layer
 */

const db = require('./dbConnection');

/**
 * Convert date string to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
 * @param {string|Date} date - Date string (ISO format) or Date object
 * @returns {string} MySQL datetime format string
 */
const toMySQLDateTime = (date) => {
  if (!date) {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
  if (date instanceof Date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
  // If it's already in MySQL format, return as is
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
    return date;
  }
  // Convert ISO format to MySQL format
  if (typeof date === 'string' && date.includes('T')) {
    return date.slice(0, 19).replace('T', ' ');
  }
  return date;
};

/**
 * Get all materials
 * @returns {Promise<Array>} Array of all materials
 */
const getAllMaterials = async () => {
  const sql = 'SELECT * FROM materials ORDER BY id ASC';
  return await db.query(sql);
};

/**
 * Get material by ID
 * @param {number|string} id - Material ID
 * @returns {Promise<Object|null>} Material object or null if not found
 */
const getMaterialById = async (id) => {
  const sql = 'SELECT * FROM materials WHERE id = ?';
  const results = await db.query(sql, [id]);
  return results.length > 0 ? results[0] : null;
};

/**
 * Create a new material
 * @param {Object} material - Material data
 * @returns {Promise<Object>} Created material with ID
 */
const createMaterial = async (material) => {
  const sql = `
    INSERT INTO materials (
      material_code, name, category, total_quantity, available_quantity,
      location, status, description, purchase_date, unit_price,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    material.material_code,
    material.name,
    material.category,
    material.total_quantity,
    material.available_quantity,
    material.location,
    material.status || 'available',
    material.description || null,
    material.purchase_date || null,
    material.unit_price,
    toMySQLDateTime(material.created_at),
    toMySQLDateTime(material.updated_at)
  ];

  const result = await db.query(sql, params);
  const created = await getMaterialById(result.insertId);
  return created;
};

/**
 * Update an existing material
 * @param {number|string} id - Material ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated material or null if not found
 */
const updateMaterial = async (id, updates) => {
  // Build dynamic update SQL
  const fields = [];
  const values = [];

  Object.keys(updates).forEach((key) => {
    if (key !== 'id' && updates[key] !== undefined) {
      fields.push(`${key} = ?`);
      // Convert date strings to MySQL datetime format
      if (key === 'created_at' || key === 'updated_at') {
        values.push(toMySQLDateTime(updates[key]));
      } else {
        values.push(updates[key]);
      }
    }
  });

  if (fields.length === 0) {
    return await getMaterialById(id);
  }

  // Always update updated_at
  if (!fields.includes('updated_at = ?')) {
    fields.push('updated_at = ?');
    values.push(toMySQLDateTime(new Date()));
  }

  values.push(id);

  const sql = `UPDATE materials SET ${fields.join(', ')} WHERE id = ?`;
  await db.query(sql, values);

  return await getMaterialById(id);
};

/**
 * Delete a material
 * @param {number|string} id - Material ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
const deleteMaterial = async (id) => {
  const sql = 'DELETE FROM materials WHERE id = ?';
  const result = await db.query(sql, [id]);
  return result.affectedRows > 0;
};

/**
 * Check if material code exists
 * @param {string} materialCode - Material code to check
 * @param {number|null} excludeId - ID to exclude from check (for updates)
 * @returns {Promise<boolean>} True if exists, false otherwise
 */
const materialCodeExists = async (materialCode, excludeId = null) => {
  let sql = 'SELECT COUNT(*) as count FROM materials WHERE material_code = ?';
  const params = [materialCode];

  if (excludeId !== null) {
    sql += ' AND id != ?';
    params.push(excludeId);
  }

  const results = await db.query(sql, params);
  return results[0].count > 0;
};

/**
 * Reset the database (for testing purposes)
 * WARNING: This will delete all data!
 */
const resetDatabase = async () => {
  await db.query('TRUNCATE TABLE materials');
};

module.exports = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  materialCodeExists,
  resetDatabase
};

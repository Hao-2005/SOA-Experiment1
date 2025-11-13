/**
 * Seed initial data for development/testing
 */

const materialService = require('../services/materialService');

/**
 * Seed demo materials data
 */
const seedData = async () => {
  const demoMaterials = [
    {
      material_code: 'EQ20230001',
      name: '笔记本电脑 ThinkPad X1',
      category: 'equipment',
      total_quantity: 10,
      available_quantity: 7,
      location: '实验室A501',
      status: 'available',
      description: '用于教学实验',
      purchase_date: '2023-09-01',
      unit_price: 8999.0
    }
  ];

  for (const item of demoMaterials) {
    try {
      // Check if material code already exists
      const exists = await materialService.materialCodeExists(item.material_code);
      if (exists) {
        // eslint-disable-next-line no-console
        console.log(`Material ${item.material_code} already exists, skipping...`);
        continue;
      }
      await materialService.createMaterial(item);
      // eslint-disable-next-line no-console
      console.log(`Seeded material: ${item.material_code}`);
    } catch (error) {
      // Ignore duplicate entry errors and other errors
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        // eslint-disable-next-line no-console
        console.log(`Material ${item.material_code} already exists, skipping...`);
      } else {
        // eslint-disable-next-line no-console
        console.warn('Failed to seed material:', item.material_code, error.message);
      }
    }
  }
};

module.exports = {
  seedData
};

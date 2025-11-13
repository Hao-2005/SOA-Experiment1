/**
 * Server entry point
 */

const app = require('./app');
const constants = require('./config/constants');
const { seedData } = require('./data/seedData');
const { testConnection } = require('./config/dbConnection');

/**
 * Start the server
 */
const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('Failed to connect to database. Please check your database configuration.');
    process.exit(1);
  }

  // Seed initial data
  try {
    await seedData();
    console.log('Initial data seeded successfully');
  } catch (error) {
    console.warn('Failed to seed initial data:', error.message);
  }

  // Start server
  const PORT = constants.PORT;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Materials service is running on port ${PORT}`);
  });
};

// Start the application
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;

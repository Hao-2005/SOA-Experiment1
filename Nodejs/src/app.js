/**
 * Express application setup
 */

const express = require('express');
const materialRoutes = require('./routes/materialRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());

// JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err.message);
    return res.status(400).json({
      code: 400,
      message: 'JSON 格式错误: ' + err.message,
      data: null
    });
  }
  next(err);
});

// Routes - mount under /api prefix
app.use('/api/materials', materialRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;


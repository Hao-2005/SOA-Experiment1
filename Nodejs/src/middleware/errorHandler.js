/**
 * Error handling middleware
 */

const { buildResponse } = require('../utils/response');

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json(buildResponse('资源未找到', null, 404));
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Error:', err);

  res.status(500).json(buildResponse('服务器内部错误', null, 500));
};

module.exports = {
  notFoundHandler,
  errorHandler
};


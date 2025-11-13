/**
 * Response utility functions
 */

/**
 * Build standardized API response
 * @param {string} message - Response message
 * @param {*} data - Response data
 * @param {number} code - Response code
 * @returns {Object} Standardized response object
 */
const buildResponse = (message, data = null, code = 200) => ({
  code,
  message,
  data
});

module.exports = {
  buildResponse
};


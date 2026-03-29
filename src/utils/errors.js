/**
 * @file Custom operational API error class.
 * @module utils/errors
 */

/**
 * Represents an operational API error that carries an HTTP status code.
 *
 * Instances of this class are caught by the global {@link module:middleware/errorHandler}
 * and translated into structured JSON error responses.
 *
 * @class ApiError
 * @extends Error
 *
 * @example
 * throw new ApiError('Product not found', 404);
 */
class ApiError extends Error {
  /**
   * Creates an `ApiError` instance.
   *
   * @param {string} message - Human-readable description of the error.
   * @param {number} [status=400] - HTTP status code to send in the response.
   */
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = ApiError;

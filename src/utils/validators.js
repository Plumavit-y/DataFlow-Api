/**
 * @file Input validation helpers used across controllers.
 * @module utils/validators
 */

/**
 * Validates that a value is a syntactically correct email address.
 *
 * @param {string} email - Value to validate.
 * @returns {boolean} `true` if the value is a non-empty string matching a
 *   basic email pattern.
 *
 * @example
 * validateEmail('user@example.com'); // true
 * validateEmail('not-an-email');     // false
 */
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && re.test(email);
};

/**
 * Validates that a password meets the minimum length requirement.
 *
 * @param {string} password - Value to validate.
 * @returns {boolean} `true` if the password is a string of at least 6 characters.
 */
const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

/**
 * Validates a product creation payload.
 *
 * @param {{ name: *, price: *, category: * }} payload - Raw request body fields.
 * @returns {{ valid: false, message: string } | { valid: true, parsedPrice: number }}
 *   An object indicating whether the payload is valid. On failure, `message`
 *   describes the first validation error found.
 */
const validateProductPayload = ({ name, price, category }) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Name is required and must be a string' };
  }

  const parsedPrice = Number(price);
  if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    return { valid: false, message: 'Price must be a positive number' };
  }

  if (!category || typeof category !== 'string') {
    return { valid: false, message: 'Category is required and must be a string' };
  }

  return { valid: true, parsedPrice };
};

/**
 * Validates and sanitizes the items array for an order.
 *
 * Each item must contain a positive integer `productId` and a positive integer
 * `quantity`. Numeric strings are coerced to numbers before validation.
 *
 * @param {Array<{ productId: *, quantity: * }>} items - Order items from the request body.
 * @returns {{ valid: false, message: string } | { valid: true, items: Array<{ productId: number, quantity: number }> }}
 *   An object indicating whether the payload is valid. On success, `items`
 *   contains the sanitized array ready for further processing.
 */
const validateOrderPayload = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, message: 'Order must contain at least one item' };
  }

  const sanitizedItems = [];

  for (const item of items) {
    const parsedProductId = Number(item.productId);
    const parsedQuantity = Number(item.quantity);

    if (
      Number.isNaN(parsedProductId) ||
      !Number.isInteger(parsedProductId) ||
      parsedProductId <= 0
    ) {
      return { valid: false, message: 'Each item must include a valid productId' };
    }

    if (
      Number.isNaN(parsedQuantity) ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return { valid: false, message: 'Each item must include a positive integer quantity' };
    }

    sanitizedItems.push({
      productId: parsedProductId,
      quantity: parsedQuantity
    });
  }

  return { valid: true, items: sanitizedItems };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateProductPayload,
  validateOrderPayload
};

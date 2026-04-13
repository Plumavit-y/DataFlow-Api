const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && re.test(email);
};

const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < 6) {
    return false;
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
};

const getPasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return { score: 0, level: 'empty' };
  }
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const levels = ['very-weak', 'weak', 'fair', 'medium', 'strong', 'very-strong'];
  return { score, level: levels[Math.min(score, levels.length - 1)] };
};

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

    if (Number.isNaN(parsedQuantity) || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return { valid: false, message: 'Each item must include a positive integer quantity' };
    }

    sanitizedItems.push({
      productId: parsedProductId,
      quantity: parsedQuantity,
    });
  }

  return { valid: true, items: sanitizedItems };
};

module.exports = {
  validateEmail,
  validatePassword,
  getPasswordStrength,
  validateProductPayload,
  validateOrderPayload,
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && re.test(email);
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
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

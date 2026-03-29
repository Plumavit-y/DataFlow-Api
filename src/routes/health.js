const express = require('express');
const { getHealth } = require('../controllers/healthController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Monitoreo y estado del servidor
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Estado de salud de la API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: El servidor está operativo
 */
router.get('/', getHealth);

module.exports = router;

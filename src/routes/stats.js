const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getStats } = require('../controllers/statsController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Metrics
 *   description: Estadísticas y KPIs del sistema
 */

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Obtener métricas de negocio
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de ventas, órdenes y valor promedio
 */
router.get('/', authenticateToken, asyncHandler(getStats));

module.exports = router;

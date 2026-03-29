const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { getStats } = require('../controllers/statsController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Metrics
 *   description: Per-user order statistics and KPIs
 */

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get spending and order statistics for the current user
 *     tags: [Metrics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated order metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSpent:
 *                   type: string
 *                   description: Total amount spent (2 decimal places)
 *                   example: "429.98"
 *                 totalOrders:
 *                   type: integer
 *                   example: 3
 *                 avgOrderValue:
 *                   type: string
 *                   description: Average value per order (2 decimal places)
 *                   example: "143.33"
 *                 recentOrders:
 *                   type: array
 *                   description: Up to the 5 most recent orders, newest first
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Authentication token required
 */
router.get('/', authenticateToken, asyncHandler(getStats));

module.exports = router;

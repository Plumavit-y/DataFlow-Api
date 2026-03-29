const express = require('express');
const { getHealth } = require('../controllers/healthController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Server health monitoring and activity feed
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check – verify the API is operational
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Process uptime in seconds
 *                 database:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: integer
 *                     products:
 *                       type: integer
 *                     orders:
 *                       type: integer
 */
router.get('/', getHealth);

module.exports = router;

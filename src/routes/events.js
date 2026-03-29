const express = require('express');
const { getEvents } = require('../data/activityLog');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: System
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve the real-time activity feed
 *     tags: [System]
 *     responses:
 *       200:
 *         description: List of the most recent system events (up to 50)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       type:
 *                         type: string
 *                         example: auth.login
 *                       summary:
 *                         type: string
 *                         example: Successful login for user@example.com
 *                       details:
 *                         type: object
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 */
router.get('/', (req, res) => {
  res.json({
    events: getEvents()
  });
});

module.exports = router;

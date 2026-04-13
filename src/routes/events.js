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
 *     summary: Obtener feed de actividad en tiempo real
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Lista de los últimos eventos del sistema
 */
router.get('/', (req, res) => {
  res.json({
    events: getEvents(),
  });
});

module.exports = router;

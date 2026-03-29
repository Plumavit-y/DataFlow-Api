const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { createOrder, listOrders, getOrder } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de pedidos y flujo de checkout
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Pedido procesado exitosamente
 *       400:
 *         description: Stock insuficiente o datos inválidos
 */
router.post('/', authenticateToken, asyncHandler(createOrder));

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar mis pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de pedidos del usuario
 */
router.get('/', authenticateToken, asyncHandler(listOrders));

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener detalle de un pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles completos del pedido
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', authenticateToken, asyncHandler(getOrder));

module.exports = router;

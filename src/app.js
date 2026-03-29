const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const statsRoutes = require('./routes/stats');
const healthRoutes = require('./routes/health');
const eventsRoutes = require('./routes/events');

const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { endpoints } = require('./data/docs');
const activityLog = require('./data/activityLog');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DataFlow API',
      version: '1.0.0',
      description: 'RESTful API modular y segura construida para portafolio profesional',
      contact: {
        name: 'Alex Silva',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Reducido a 1 minuto para pruebas más rápidas
  max: 100, // 100 peticiones por minuto
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Permitir tráfico ilimitado desde localhost para la demo
    const ip = req.ip || req.connection.remoteAddress;
    return ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1';
  },
  message: { error: 'Too many requests, please try again later.' }
});

const app = express();

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Permitir scripts inline para el dashboard de demo
}));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', apiLimiter);

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Expose Swagger spec as JSON for Scalar to consume
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Serve Modern API Reference (Scalar - Vercel/Stripe style)
app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>DataFlow API Reference</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
        <style>
          body { margin: 0; padding: 0; }
          /* Custom Scalar overrides for a seamless Vercel-like feel */
          :root {
            --theme-font: 'Inter', sans-serif;
            --theme-font-code: 'JetBrains Mono', monospace;
            --theme-color-accent: #4f46e5;
          }
        </style>
      </head>
      <body>
        <!-- Scalar API Reference Component -->
        <script
          id="api-reference"
          data-url="/api-docs.json"
          data-layout="modern"
          data-theme="default"
        ></script>
        <!-- Load Scalar from CDN -->
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/health', healthRoutes);

// Documentation endpoint (legacy/internal)
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'DataFlow API Documentation',
    version: '1.0.0',
    description: 'Complete REST API for portfolio demonstration',
    baseUrl: 'http://localhost:3000',
    endpoints
  });
});

// Export logs endpoints
app.get('/api/export/logs', (req, res) => {
  const format = (req.query.format || 'json').toLowerCase();
  const events = activityLog.getEvents();

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="activity-log-${Date.now()}.json"`);
    res.send(JSON.stringify({ exported: new Date().toISOString(), count: events.length, events }, null, 2));
  } else if (format === 'csv') {
    const csv = convertToCSV(events);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="activity-log-${Date.now()}.csv"`);
    res.send(csv);
  } else {
    res.status(400).json({ error: 'Invalid format. Use json or csv.' });
  }
});

// Helper function to convert events to CSV
function convertToCSV(events) {
  if (!events || events.length === 0) {
    return 'No events to export';
  }

  const headers = ['timestamp', 'type', 'summary', 'details'];
  const rows = events.map(event => [
    event.timestamp,
    event.type,
    `"${(event.summary || '').replace(/"/g, '""')}"`,
    `"${JSON.stringify(event.details || {}).replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

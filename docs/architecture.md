# Arquitectura del Proyecto

## Estructura de carpetas
- `server.js`: Entry point
- `src/app.js`: Configuración Express
- `src/controllers/`: Lógica de negocio
- `src/routes/`: Endpoints
- `src/middleware/`: Middlewares
- `src/data/`: Almacenamiento en memoria y logs
- `src/utils/`: Utilidades
- `public/`: Dashboard demo
- `__tests__/`: Pruebas
- `docs/`: Documentación

## Flujo de datos
1. Request HTTP → Middleware → Rutas → Controladores → Respuesta
2. Autenticación JWT para rutas protegidas

## Decisiones técnicas
- Express, JWT, almacenamiento en memoria, validaciones, Swagger para docs.

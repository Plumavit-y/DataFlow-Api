# API Reference

La documentación OpenAPI/Swagger está disponible en `/docs` cuando la app está corriendo.

## Endpoints principales

- `POST /api/auth/login` — Login de usuario
- `POST /api/auth/register` — Registro de usuario
- `GET /api/products` — Listar productos
- `POST /api/orders` — Crear orden
- `GET /api/stats` — Estadísticas
- `GET /api/health` — Health check

## Ejemplo de request (curl)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password"}'
```

Consulta la documentación Swagger para detalles completos y parámetros.

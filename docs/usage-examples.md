# Ejemplos de Uso

## Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password"}'
```

## Obtener productos
```bash
curl http://localhost:3000/api/products
```

## Crear orden
```bash
curl -X POST http://localhost:3000/api/orders \
  -H 'Authorization: Bearer <token>' \
  -d '{"productId":1,"quantity":2}'
```

Consulta más ejemplos en la documentación Swagger (`/docs`).

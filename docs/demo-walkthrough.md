# Guion para demo grabada

Esta sección describe paso a paso lo que puedes mostrar en la pantalla al grabar el backend. Cada tramo incluye el comando (o acción) y qué resaltar en video.

## 1. Inicio del servidor

1. Ejecuta `npm run dev` (o `npm start`) en la raíz.
2. Muestra la consola desplegando el banner con los endpoints disponibles.
3. Explica brevemente que el rate limiter protege `/api/*` y que la configuración principal vive en `src/app.js`.

## 2. Registro y login

1. Usa `curl` para registrar un usuario nuevo:
   ```bash
   curl -s -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@portfolio.dev","name":"Demo User","password":"DemoPass1"}'
   ```
2. Destaca la respuesta JSON con el `token`.
3. Ejecuta login y guarda el token:
   ```bash
   curl -s -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@portfolio.dev","password":"DemoPass1"}'
   ```
4. Usa el token para llamar `/api/auth/me` y muestra los campos del perfil.

## 3. Flujo de productos

1. Muestra la lista pública de productos con `curl http://localhost:3000/api/products`.
2. Loguea al admin (`admin@portfolio.dev / Admin123!`) y registra su token. Puedes copiar el token directamente de la salida del login en pantalla.
3. Crea un producto nuevo para resaltar validaciones y rol admin:
   ```bash
   curl -s -X POST http://localhost:3000/api/products \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <ADMIN_TOKEN>" \
     -d '{"name":"Portfolio Mug","price":19.99,"category":"Merch","stock":40}'
   ```
4. Muestra la salida y luego lista `/api/products` otra vez para confirmar el nuevo registro.

## 4. Orden y estadísticas

1. Desde el usuario demo (token anterior), crea una orden con un par de productos:
   ```bash
   curl -s -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <USER_TOKEN>" \
     -d '{"items":[{"productId":1,"quantity":2},{"productId":4,"quantity":1}]}'
   ```
   Muestra la respuesta y recalca la reducción de stock.
2. Consulta `/api/stats` usando el mismo token para exhibir métricas (`totalSpent`, `avgOrderValue`, etc.).

## 5. Salud y cierre

1. Termina con `/api/health` para mostrar el conteo de usuarios/productos/órdenes.
2. Cierra la grabación explicando cómo la arquitectura modular permite añadir persistencia real (SQLite/Postgres) y pruebas adicionales sin rehacer el servidor.

Tip: Si grabas en segmentos, asegúrate de copiar los tokens y outputs en notas para acelerar el tiempo de edición.

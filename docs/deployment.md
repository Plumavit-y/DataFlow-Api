# Despliegue

## Local

1. Clona el repositorio
2. Copia `.env.example` a `.env` y configura las variables
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Inicia la app:
   ```bash
   npm start
   ```

## Producción

- Usa variables de entorno seguras
- Considera PM2 o Docker para producción
- Configura HTTPS y CORS según tu entorno

## Cloud

- Puedes desplegar en servicios como Heroku, Vercel, Railway, etc.
- Consulta la documentación de cada plataforma para detalles.

# Preguntas Frecuentes (FAQ)

**¿Cómo cambio el puerto?**
- Edita la variable `PORT` en tu archivo `.env`.

**¿Cómo agrego un nuevo endpoint?**
- Crea una ruta en `src/routes/` y su controlador en `src/controllers/`.

**¿Por qué recibo un error 401?**
- Verifica tu token JWT y que la ruta requiera autenticación.

**¿Dónde están los datos?**
- El almacenamiento es en memoria (ver `src/data/`). No hay base de datos persistente por defecto.

¿Tienes otra pregunta? ¡Abre un issue o revisa la documentación Swagger!

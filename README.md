# 🚀 DataFlow API | Modern REST Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/framework-express-blue.svg)](https://expressjs.com/)
[![Swagger Docs](https://img.shields.io/badge/docs-swagger-indigo.svg)](http://localhost:3000/api-docs)

**DataFlow API** es una solución robusta y modular diseñada para demostrar estándares de ingeniería de software en un entorno real. Este proyecto no es solo un servidor; es una exhibición de **mejores prácticas** en seguridad, documentación y experiencia de usuario.

[**Explorar Dashboard en vivo**](http://localhost:3000) | [**Ver Documentación API**](http://localhost:3000/api-docs)

---

## ✨ Características Principales

- 🔐 **Seguridad de Grado Industrial:** Implementación de `helmet`, `cors` y `express-rate-limit`.
- 📚 **Documentación Interactiva:** Swagger UI totalmente integrado para probar endpoints en tiempo real.
- 📊 **Dashboard SaaS:** Panel de monitoreo moderno construido con Vanilla JS/CSS (Inter font, Glassmorphism).
- 🔑 **Autenticación JWT:** Flujo completo de registro, login y protección de rutas por roles (`admin`/`user`).
- 🛠️ **Arquitectura Limpia:** Separación clara entre Rutas, Controladores, Middlewares y Utilidades.
- 📝 **Logging Profesional:** Integración de `morgan` para trazabilidad completa de peticiones.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Seguridad:** JSON Web Tokens (JWT), BcryptJS, Helmet
- **Documentación:** Swagger (OpenAPI 3.0)
- **Frontend:** Vanilla HTML5, CSS3 (Modern SaaS UI), JavaScript ES6+
- **Testing:** Jest, Supertest

---

## 🚀 Instalación y Uso

1. **Clonar y Preparar:**
   ```bash
   npm install
   ```

2. **Ejecutar en Desarrollo:**
   ```bash
   npm run dev
   ```

3. **Ver el Proyecto:**
   - **Dashboard:** [http://localhost:3000](http://localhost:3000)
   - **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

4. **Simular Tráfico (Demo Mode):**
   ```bash
   npm run demo-loop
   ```
   *Este comando genera eventos automáticos para ver el dashboard en acción.*

---

## 📂 Estructura del Proyecto

```text
├── public/              # Dashboard UI (Modern SaaS style)
├── src/
│   ├── app.js           # Configuración central (Helmet, Morgan, Swagger)
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Auth, Error Handler, Security
│   ├── routes/          # Definición de endpoints + Swagger JSDoc
│   └── utils/           # Validadores y helpers
└── __tests__/           # Pruebas de integración
```

---

## 🔐 Credenciales de Prueba (Demo)

| Rol | Email | Password |
| --- | --- | --- |
| **Admin** | `admin@portfolio.dev` | `Admin123!` |
| **User** | `user@portfolio.dev` | `User123!` |

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo como base para tus propios proyectos.

---

Desarrollado con ❤️ por **Alex Silva** para su Portafolio Profesional.

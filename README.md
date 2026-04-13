# DataFlow API | REST API Profesional

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-18%2B-brightgreen.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.x-blue.svg)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/auth-JWT-yellowgreen.svg)](https://jwt.io/)
[![Testing](https://img.shields.io/badge/testing-Jest-red.svg)](https://jestjs.io/)
[![CI/CD](https://img.shields.io/badge/CI-CD-GitHub%20Actions-blue.svg)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/deploy-Docker-blue.svg)](https://docker.com/)

REST API construída con estándares de producción. Incluye autenticación JWT, control de acceso por roles, documentación Swagger, tests con Jest y Docker para deployment.

[**Dashboard**](http://localhost:3000) | [**Documentación API**](http://localhost:3000/api-docs)

---

## Por qué este proyecto?

Quería crear algo que sirviera como demo técnica real y no solo un ejemplo básico. Acá hay:

- Autenticación con JWT funcionando (no csak token, con verify y refresh)
- Roles de usuario (admin vs user)
- API documentada con Swagger/OpenAPI
- Panel de monitoreo en tiempo real
- Tests con Jest que pasan
- CI/CD con GitHub Actions
- Docker multistage para producción

Básicamente lo que tendría un side project o app real de tamaño pequeño.

---

## Stack Técnico

| Categoría | Tecnología                 |
| --------- | -------------------------- |
| Runtime   | Node.js 18+                |
| Framework | Express.js 4.x             |
| Auth      | JWT + bcrypt               |
| Security  | helmet, cors, rate-limit   |
| Docs      | swagger-jsdoc, OpenAPI 3.0 |
| Tests     | Jest + Supertest           |
| Lint      | ESLint + Prettier          |
| Deploy    | Docker + docker-compose    |

---

## Empezar

```bash
# Instalación
git clone https://github.com/Plumavit-y/DataFlow-Api.git
cd DataFlow-Api
cp .env.example .env
npm install

# Arrancar en desarrollo
npm run dev

# Tests
npm test

# Lint y format
npm run lint
npm run format
```

**En el navegador:**

- Dashboard: http://localhost:3000
- Docs API: http://localhost:3000/api-docs
- Health: http://localhost:3000/api/health

---

## Demo Mode

Para ver el dashboard con actividad:

```bash
npm run demo-loop
```

Esto genera requests automáticos para ver cómo se ve el panel en vivo.

---

## Estructura

```
dataflow-api/
├── .github/workflows/     # CI/CD
├── public/                # Dashboard
│   ├── index.html
│   ├── login.html
│   └── dashboard.js
├── src/
│   ├── app.js             # Config Express
│   ├── config/           # Variables de entorno
│   ├── controllers/     # Lógica de negocio
│   ├── data/             # Storage in-memory
│   ├── middleware/      # Auth, errores
│   ├── routes/          # Endpoints
│   └── utils/           # Validaciones
├── __tests__/            # Tests
├── docs/                 # Docs tambahan
├── server.js            # Entry point
└── package.json
```

---

## Endpoints Principales

| Endpoint             | Método | Auth    | Descripción         |
| -------------------- | ------ | ------- | ------------------- |
| `/api/auth/register` | POST   | Público | Registrar usuario   |
| `/api/auth/login`    | POST   | Público | Login, retorna JWT  |
| `/api/auth/me`       | GET    | Bearer  | Perfil del usuario  |
| `/api/products`      | GET    | Público | Listar productos    |
| `/api/products`      | POST   | Admin   | Crear producto      |
| `/api/products/:id`  | PUT    | Admin   | Actualizar          |
| `/api/products/:id`  | DELETE | Admin   | Eliminar            |
| `/api/orders`        | POST   | Bearer  | Crear orden         |
| `/api/orders`        | GET    | Bearer  | Ver mis órdenes     |
| `/api/stats`         | GET    | Bearer  | Stats del dashboard |
| `/api/health`        | GET    | Público | Health check        |

---

## Credenciales de Prueba

| Rol   | Email                 | Password    |
| ----- | --------------------- | ----------- |
| Admin | `admin@portfolio.dev` | `Admin123!` |
| User  | `user@portfolio.dev`  | `User123!`  |

---

## Documentación Adicional

- [Referencia API](docs/api.md)
- [Arquitectura](docs/architecture.md)
- [Testing](docs/testing.md)
- [Deployment](docs/deployment.md)

---

## Calidad de Código

```bash
# Todo junto
npm run lint && npm run format && npm test
```

CI corre en cada push y PR:

- ESLint + Prettier check
- Tests Jest
- Security audit

---

## Deploy con Docker

```bash
# Build producción
docker build -t dataflow-api .

# Run
docker run -p 3000:3000 dataflow-api

# O con docker-compose
docker-compose up -d
```

---

## Licencia

MIT - libre de usar.

---

Hecho por **Alex Silva** para portafolio técnico.

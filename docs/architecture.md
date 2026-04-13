# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐          │
│  │  Dashboard  │  │  Swagger UI  │  │   cURL    │          │
│  └──────┬──────┘  └──────┬───────┘  └─────┬────┘          │
└─────────┼────────────────┼───────────────┼─────────────────┘
          │                │               │
          ▼                ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Express Server                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Middleware Stack                         │  │
│  │  helmet → cors → morgan → rate-limit → body-parser    │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                  Routes Layer                    │  │
│  │  /auth → /products → /orders → /stats → /health  │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Controller Layer                           │
│  ┌───────────┐  ┌────────────┐  ┌─────────┐  ┌──────────┐   │
│  │  Auth    │  │  Product  │  │  Order │  │  Stats   │   │
│  └───────────┘  └────────────┘  └─────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer (In-Memory)                    │
│  ┌───────────┐  ┌────────────┐  ┌───────────────────┐          │
│  │  Store   │  │ Activity  │  │  Swagger Spec    │          │
│  │ (users,  │  │   Log    │  │  (OpenAPI 3.0)  │          │
│  │ products │  │          │  │                 │          │
│  │ orders)  │  │          │  │                 │          │
│  └───────────┘  └────────────┘  └───────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

```
HTTP Request
    │
    ▼
┌──────────────────────┐
│ 1. Security Middleware│
│    (helmet, cors,    │
│     rate-limit)      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 2. Auth Middleware   │
│   (JWT verify)      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 3. Route Matching  │
│   (Express router) │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 4. Controller      │
│ (Business Logic)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 5. Data Layer     │
│  (Store/Library)  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 6. Response      │
│   (JSON)        │
└──────────────────────┘
```

## File Structure

```
src/
├── app.js                 # Express app configuration
├── config/
│   └── index.js          # Environment configuration
├── controllers/        # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── statsController.js
│   └── healthController.js
├── data/               # Data storage
│   ├── store.js        # In-memory database
│   ├── activityLog.js # Event logging
│   └── docs.js         # API documentation
├── middleware/        # Custom middleware
│   ├── auth.js        # JWT authentication
│   ├── errorHandler.js
│   └── requestId.js   # Request tracing
├── routes/            # API routes
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── stats.js
│   ├── health.js
│   └── events.js
└── utils/             # Utilities
    ├── asyncHandler.js
    ├── errors.js
    ├── token.js
    └── validators.js
```

## Design Patterns

### 1. MVC Architecture

Routes → Controllers → Data Store

### 2. Middleware Pattern

Stack-based middleware chain for cross-cutting concerns

### 3. Error Handling

Centralized async error handling with `asyncHandler`

### 4. Role-Based Access Control

JWT payload includes `role`, checked in controllers

## Security Architecture

```
┌───────────────��────────────────────┐
│         Defense Timeline           │
├────────────────────────────────────┤
│ 1. Helmet (HTTP headers)          │
│ 2. CORS (Origin whitelist)       │
│ 3. Rate Limit (DoS protection) │
│ 4. JWT (Authentication)         │
│ 5. bcrypt (Password hashing)    │
│ 6. Input Validation           │
│ 7. Error Handling (no leaks)   │
└────────────────────────────────────┘
```

## Deployment Options

| Method         | Use Case      |
| -------------- | ------------- |
| Node.js        | Development   |
| Docker         | Production    |
| Docker Compose | Orchestration |

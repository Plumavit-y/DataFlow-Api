# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Environment configuration with `dotenv` and `src/config/index.js`
- ESLint + Prettier configuration with professional rules
- GitHub Actions CI/CD pipeline (lint, test, security audit)
- GitHub issue and PR templates
- Docker configuration files
- Docker Compose for development and production

### Changed

- README with enterprise-grade documentation and badges
- Package.json scripts (lint, format, test)
- Server.js with graceful shutdown handling
- Token utility to use config module

### Security

- JWT_SECRET now loaded from environment variables (required in production)
- Input validation enhanced
- New `requireAdmin` and `requireRole` middleware

---

## [1.0.0] - 2026-04-12

### Added

- Initial release
- Express.js REST API with JWT authentication
- Swagger/OpenAPI documentation
- Interactive dashboard with real-time updates
- Product, Order, and User management
- Role-based access control (admin/user)
- Activity logging with JSON/CSV export
- Demo mode with automatic traffic generation
- In-memory storage
- Jest + Supertest integration tests

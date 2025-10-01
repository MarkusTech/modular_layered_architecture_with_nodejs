# modular_layered_architecture_with_nodejs

# Folder Structure
```bash
src/
├── config/ # Environment, Prisma client, Redis, Logger
├── middlewares/ # Auth, error handling, validation, rate limiting
├── modules/ # Each module represents a business domain
│ ├── user/
│ │ ├── user.routes.ts
│ │ ├── user.controller.ts
│ │ ├── user.service.ts
│ │ ├── user.repository.ts
│ │ ├── user.schema.ts
│ │ └── user.events.ts
│ │
│ ├── product/
│ │ ├── product.routes.ts
│ │ ├── product.controller.ts
│ │ ├── product.service.ts
│ │ ├── product.repository.ts
│ │ ├── product.schema.ts
│ │ └── product.events.ts
│ │
│ ├── order/
│ ├── payment/
│ └── inventory/
│
├── jobs/ # Scheduled tasks, cron jobs
├── utils/ # ApiError, helpers, DTOs
├── app.ts # Express app setup
└── server.ts # Entry point
```

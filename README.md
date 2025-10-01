# modular_layered_architecture_with_nodejs

# Feature
- Modular layered structure for clean separation of concerns
- Fully typed with TypeScript for safety and maintainability
- Easy to add new modules (Auth, User, Wallet, Payment, etc.)
- Integrated with Prisma ORM for database operations
- Middleware support: authentication, validation, rate limiting, error handling
- Ready for production with caching, background jobs, and logging

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
# Module Structure
```bash
modules/
  <module>/
    <module>.controller.ts
    <module>.service.ts
    <module>.repository.ts
    <module>.routes.ts
    <module>.dto.ts
    <module>.validator.ts

```

# Installation
# 1. Clone the repository
``` bash
git clone https://github.com/MarkusTech/modular_layered_architecture_with_nodejs.git
cd modular_layered_architecture_with_nodejs
```
# 2. Install dependencies
``` bash
npm install
or
npm i
```
# 3. Set up environment variables
- Create a .env file in the root:
``` bash
DATABASE_URL="mysql://user:password@localhost:3306/db_name"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your_jwt_secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

# 4. Run Prisma migrations
``` bash
npx prisma migrate dev --name init
npx prisma generate
```

# 5. Start the server
``` bash
npm run dev
```


``` bash 
 Happy Coding!!!!
```

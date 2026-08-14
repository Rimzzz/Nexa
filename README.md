# Nexa POS System

Point of Sale (POS) System built with modern tech stack.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite + Pinia
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL 16
- **Web Server**: Nginx (reverse proxy)
- **Containerization**: Docker + Docker Compose

## Features

- Authentication (JWT)
- Transaction Management (Penjualan)
- Expense Management (Pengeluaran)
- Item Management
- Role-based access (Cashier/Admin)

## Prerequisites

- Docker
- Docker Compose
- Node.js 20+ (for local development)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
cd /home/ubuntu/project/Nexa
```

### 2. Build and start containers
```bash
docker compose up -d --build
```

### 3. Access the application
- Frontend: http://localhost
- API: http://localhost/api
- Swagger docs: http://localhost/api (after first login)

## Environment Variables

Create `.env` file in root directory:

```env
# Backend
NODE_ENV=production
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=nexa_user
DB_PASSWORD=nexa_pass_123
DB_NAME=nexa_db

# JWT
JWT_SECRET=nexa_jwt_secret_key_2024
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `DELETE /api/transactions/:id` - Delete transaction

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `DELETE /api/expenses/:id` - Delete expense

### Items
- `POST /api/items` - Create item
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item (soft delete)

## Development

### Start development servers
```bash
# Backend
cd backend && npm run start:dev

# Frontend
cd frontend && npm run dev
```

### Run migrations (if using TypeORM migrations)
```bash
cd backend && npm run migration:run
```

## Project Structure

```
Nexa/
├── docker-compose.yml
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── transactions/
│   │   │   ├── expenses/
│   │   │   └── items/
│   │   ├── entities/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── router/
│   │   └── App.vue
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
└── nginx/
    ├── nginx.conf
    └── conf.d/
        └── default.conf
```

## License

MIT

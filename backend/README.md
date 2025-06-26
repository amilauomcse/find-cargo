# Cargo Backend

A NestJS backend with multi-tenant authentication and cargo management.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Yarn
- Docker & Docker Compose

### Running the Backend

1. **Start everything with one command:**
   ```bash
   yarn start
   ```
   
   This will:
   - Create a `.env` file if it doesn't exist
   - Start Docker databases (PostgreSQL)
   - Install dependencies if needed
   - Start the backend server
   - **Automatically run migrations** for both databases
   - **Create root user** in the auth database

2. **Access the application:**
   - Backend API: http://localhost:3000
   - Root user: `root@email.com` / `123`

### Available Scripts

- `yarn start` - Start everything (databases + backend)
- `yarn dev` - Same as `yarn start`
- `yarn start:dev` - Start only the backend (if databases are already running)
- `yarn create-root` - Create root user manually
- `yarn test-db` - Test database connections

### Database Migrations

The backend automatically runs migrations on startup:

- **System Database (cargo_db)**: Creates tables for inquiries, rates, and sales calls
- **Auth Database (auth_db)**: Creates authentication tables and root user

Migrations are located in `backend/migrations/` and run automatically when the app starts.

### Environment Variables

The `.env` file will be created automatically with these defaults:

```env
# Application Configuration
APP_ENV=development
NODE_ENV=development
PORT=3000

# System Database Configuration (Docker containers)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=cargo_db
DB_LOG_ENABLE=true

# Auth Database Configuration (Docker containers)
AUTH_DB_HOST=localhost
AUTH_DB_PORT=5434
AUTH_DB_USERNAME=postgres
AUTH_DB_PASSWORD=postgres
AUTH_DB_NAME=auth_db
AUTH_DB_LOG_ENABLE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRE_TIMEOUT=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Root User Configuration
ROOT_USER_EMAIL=root@email.com
ROOT_USER_PASSWORD=123

# Logging
LOG_LEVEL=debug
```

### Docker Databases

The backend uses two PostgreSQL databases running in Docker:
- **System DB**: `postgres_db` (port 5432) - for cargo data
- **Auth DB**: `auth_postgres_db` (port 5434) - for authentication

### API Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - Organization registration
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/users` - Create new user (admin only)

### Stopping the Application

Press `Ctrl+C` to stop the backend server.

To stop Docker databases:
```bash
docker-compose down
```

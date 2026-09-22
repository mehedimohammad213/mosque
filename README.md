# Mosque API

Express.js + TypeScript + PostgreSQL (`pg` driver) with plain SQL migrations.

## Setup

1. Create a PostgreSQL database:

```bash
createdb mosque
```

2. Copy env and edit credentials:

```bash
cp .env.example .env
```

3. Install dependencies (if needed) and run migrations:

```bash
npm install
npm run migrate
```

4. Start the server:

```bash
npm run dev
```

Health check: `GET http://localhost:3000/health`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run with `tsx` watch (TypeScript) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server from `dist/` |
| `npm run migrate` | Apply pending SQL migrations |
| `npm run typecheck` | Type-check without emitting |

## Project layout (MVC + services)

```
sql/migrations/          Plain SQL schema files
src/config/db.ts         pg Pool
src/db/migrate.ts        Migration runner
src/models/              Table / field structure + types
src/services/            Business logic, validation + SQL queries
src/controllers/         HTTP request / response only
src/routes/              Route wiring only
src/middleware/          asyncHandler, AppError
src/app.ts               Express entry
```

| Layer | Role |
|-------|------|
| **Route** | Maps HTTP method/path → controller |
| **Controller** | Reads `req`, calls service, writes `res` |
| **Service** | Validation + business logic + SQL queries (`pg`) |
| **Model** | Table / field structure + TypeScript types (no queries) |
| **View** | JSON responses (API; no template engine) |

Flow: `Route → Controller → Service (validate + SQL) → PostgreSQL`  
Models are used by services for table names and field definitions only.

## Tables

- `mosques`
- `users` → optional `mosque_id`
- `weekly_collections` → `mosque_id`, optional `submitted_by`
- `fund_requests` → `mosque_id`, optional `created_by` / `approved_by`
- `mosque_payment_accounts` → `mosque_id`

## API

| Method | Path | Notes |
|--------|------|--------|
| GET/POST | `/api/mosques` | List / create |
| GET/PUT/DELETE | `/api/mosques/:id` | |
| GET/POST | `/api/users` | Password hashed with bcrypt |
| GET/PUT/DELETE | `/api/users/:id` | |
| GET/POST | `/api/weekly-collections` | |
| GET/PUT/DELETE | `/api/weekly-collections/:id` | |
| GET/POST | `/api/fund-requests` | |
| GET/PUT/DELETE | `/api/fund-requests/:id` | |
| GET/POST | `/api/payment-accounts` | |
| GET/PUT/DELETE | `/api/payment-accounts/:id` | |

Query filters (where supported): `status`, `division`, `district`, `mosque_id`, `role`, `fund_year`, `account_type`, `is_active`.

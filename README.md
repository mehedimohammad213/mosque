# Mosque

Mosque management platform — Express API + Next.js admin frontend.

## Structure

```
backend/   Express + TypeScript + PostgreSQL API (port 3000)
frontend/  Next.js admin panel (port 3001)
```

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev
```

## Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

Demo login: phone `01000000000` / password `admin123`

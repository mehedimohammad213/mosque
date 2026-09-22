# Mosque Frontend

Next.js admin panel connected to the Express Mosque API.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

App: [http://localhost:3001](http://localhost:3001)

## Login

Demo admin:

- Phone: `01000000000`
- Password: `admin123`

## Pages

- `/login` — sign in
- `/dashboard` — overview + sidebar
- `/dashboard/mosques` — mosque CRUD
- `/dashboard/users` — user CRUD
- `/dashboard/payments` — payment account CRUD
- `/dashboard/requests` — fund request CRUD
- `/dashboard/collections` — weekly collection CRUD

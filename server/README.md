# Skillshare API

This folder contains the Prisma-based backend starter for the LMS refactor.

## Stack

- Express
- Prisma
- PostgreSQL
- JWT auth with refresh sessions

## Setup

1. Copy `server/.env.example` to `server/.env`
2. Install dependencies inside `server/`
3. Run Prisma migration or `prisma db push`
4. Start the API

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```

## API Prefix

```txt
http://localhost:4000/api/v1
```

Frontend should move away from direct database access and call these endpoints instead.

## Seeded Test Accounts

After `npm run seed`, use these accounts:

- `admin@skillshare.local` / `password123`
- `instructor@skillshare.local` / `password123`
- `student@skillshare.local` / `password123`

## Quick API Test Flow

1. `POST /api/v1/auth/login`
2. Copy the `accessToken`
3. Test:
   - `GET /api/v1/courses`
   - `GET /api/v1/student/dashboard/overview`
   - `GET /api/v1/instructor/courses`
   - `GET /api/v1/admin/dashboard/overview`

For protected routes send:

```txt
Authorization: Bearer <accessToken>
```

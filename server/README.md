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
npm run dev
```

## API Prefix

```txt
http://localhost:4000/api/v1
```

Frontend should move away from direct database access and call these endpoints instead.

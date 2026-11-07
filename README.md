# NexusHQ Backend

[![CI](https://github.com/fardanahmed/nexushq-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/fardanahmed/nexushq-backend/actions/workflows/ci.yml)

REST API for the NexusHQ marketing site ([nexushq](https://github.com/fardanahmed/nexushq)): site content, contact form, waitlist and basic JWT auth. Node 22, Express 5, MongoDB (Mongoose), TypeScript, zod.

The client portal itself is not built yet; auth (register / login / me) is the only groundwork for it.

## Endpoints

All bodies and responses are JSON. Error responses are `{ "message": string }`.

| Method | Path | Body | Response | Auth |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | - | `200 { status, message, timestamp }` | - |
| GET | `/api/features` | - | `200 { items: [{ id, title, description, icon, created_at }] }` | - |
| GET | `/api/settings/:key` | - | `200 { value }`, `404` if missing | - |
| POST | `/api/contact` | `{ name, email, subject, message }` | `201 { message }`, `400` on invalid input | - |
| POST | `/api/waitlist` | `{ email }` | `201 { message }` (same response for duplicates) | - |
| POST | `/api/auth/register` | `{ email, password }` (password 6+ chars) | `201 { token }`, `409` if the email exists | - |
| POST | `/api/auth/login` | `{ email, password }` | `200 { token }`, `401` on bad credentials | - |
| GET | `/api/auth/me` | - | `200 { id, email }`, `401` | `Authorization: Bearer <token>` |

`/api/contact`, `/api/waitlist` and `/api/auth/*` are rate limited (30 requests per 15 minutes per IP). Request bodies are limited to 50kb. CORS only allows the origins in `CORS_ORIGIN`.

## Environment variables

Copy `.env.example` to `.env`.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (required) |
| `JWT_SECRET` | Secret used to sign JWTs (required) |
| `PORT` | HTTP port (default `5000`) |
| `CORS_ORIGIN` | Comma-separated allowed origins (default `http://localhost:4321`, the Astro dev server) |

## Scripts

```bash
pnpm install
pnpm dev      # tsx watch, http://localhost:5000/api/health
pnpm build    # tsc -> dist/
pnpm start    # node dist/server.js
pnpm test     # vitest + supertest on an in-memory MongoDB (the first run downloads a mongod binary)
pnpm seed     # upsert the features and settings the frontend falls back to
```

## Docker

```bash
JWT_SECRET=$(openssl rand -hex 32) docker compose up --build
```

Starts the API on port 5000 and MongoDB 7 (data in the `mongo-data` volume, published on 27017). To seed it, run `MONGODB_URI=mongodb://localhost:27017/nexushq pnpm seed` on the host.

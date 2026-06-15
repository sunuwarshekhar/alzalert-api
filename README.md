# alzalert-api

Node.js + Express REST API for AlzAlert — missing elderly person alert system.

## Setup

```bash
createdb alzalert
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret
npm install
npm run seed
npm run dev
```

Runs at `http://localhost:5000`

## Environment

See `.env.example` for all variables (`DB_*`, `JWT_*`, `AWS_*`, `S3_BUCKET_NAME`).

## Scripts

| Command        | Description                 |
| -------------- | --------------------------- |
| `npm run dev`  | Start dev server with watch |
| `npm start`    | Start server                |
| `npm run seed` | Reset and seed database     |

## Seed accounts

Password for all: `password123`

- `agendra@gmail.com` (admin)
- `yanzi@gmail.com` (caregiver)
- `hemant@gmail.com` (community)

## Related repo

Frontend: **alzalert-ui**

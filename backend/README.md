# Oracle + Flask Backend (Financial Literacy Platform)
This repository contains an example development setup using Oracle XE (Docker) and a Flask backend.

## How to run (development)
1. Copy `.env.example` to `.env` and fill values if needed.
2. Start services:
   ```bash
   docker-compose up --build
   ```
3. After Oracle is ready, enter the Oracle container and run `db/schema.sql` and `db/seed.sql` to create schema and seed data.
   Example:
   ```bash
   docker exec -it oracle_xe bash
   sqlplus / as sysdba
   -- then run scripts as appropriate or use SQL Developer to connect
   ```
4. The Flask backend will be available at `http://localhost:5000/`.

## Notes
- Seed passwords in `db/seed.sql` are plaintext for dev convenience. Use `POST /auth/register` to create users with hashed passwords.
- For production, secure secrets and use proper migration tooling (Alembic / custom scripts).

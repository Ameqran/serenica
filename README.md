# Serenica Platform

Serenica is now split into:

- Spring Boot backend (`/`) secured by Keycloak JWT
- Next.js frontend (`/frontend`) with Keycloak login and a modern clinical workspace UI

The platform starts empty (no seed/dummy data).

## Stack

- Java 21 + Maven + Spring Boot 3.3
- PostgreSQL 16
- Keycloak 26 (Docker)
- Next.js 16 + TypeScript + Lucide icons
- Lombok

## Features Implemented

- Patients management
- Bookings management
- Sessions management
- Sessions editor (manual notes)
- Notes library
- Dashboard
- Keycloak authentication (frontend + backend)

AI workflows are intentionally deferred.

## Project Structure

- `src/main/java/com/ameqran/serenica` -> backend API
- `frontend` -> Next.js frontend app
- `docker-compose.yml` -> Postgres + Keycloak + Keycloak DB
- `infra/keycloak/realm-serenica.json` -> imported Keycloak realm config

## Local Setup

1. Start infrastructure:

```bash
docker compose up -d postgres keycloak-db keycloak
```

2. Run backend:

```bash
mvn spring-boot:run
```

3. Configure frontend env:

```bash
cp frontend/.env.example frontend/.env.local
```

4. Run frontend:

```bash
cd frontend
npm install
npm run dev
```

5. Open frontend:

- `http://localhost:3000`

## Keycloak Test Credentials

Realm import includes a ready local user:

- Username: `therapist`
- Password: `therapist123`

Admin console:

- `http://localhost:8081/admin`
- Admin user: `admin`
- Admin password: `admin`

## Build Verification

Backend:

```bash
mvn -DskipTests package
```

Frontend:

```bash
cd frontend
npm run build
```

## API Endpoints

- `GET/POST/PUT /api/patients`
- `GET/POST/PUT /api/bookings`
- `GET/POST/PUT /api/sessions`
- `GET /api/sessions/{id}/editor`
- `POST /api/sessions/{id}/notes`
- `GET/POST/PUT /api/notes`
- `GET /api/dashboard/overview`

All `/api/**` endpoints require a valid Keycloak bearer token.

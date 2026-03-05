# Serenica

Spring Boot backend + HTML frontend for therapy workflow management.

## Stack

- Java 21
- Spring Boot 3.3.x
- Maven (simple single-module architecture)
- PostgreSQL (Docker Compose)
- Lombok

## Functional Scope

Implemented modules:

- Patients (clients)
- Bookings
- Sessions
- Session editor
- Manual notes
- Notes library
- Dashboard

AI features are intentionally placeholder-only for now.

## Project Structure

- `src/main/java/com/ameqran/serenica` -> backend application, domain, services, controllers
- `src/main/resources/static/index.html` -> frontend served by Spring Boot
- `docker-compose.yml` -> PostgreSQL service

## Run

1. Start PostgreSQL:

```bash
docker compose up -d postgres
```

2. Run app (Java 21):

```bash
mvn spring-boot:run
```

3. Open:

- Frontend: `http://localhost:8080`
- Dashboard API: `http://localhost:8080/api/dashboard/overview`

## Build (no tests)

```bash
mvn -DskipTests package
```

## API Endpoints

- `GET/POST/PUT /api/patients`
- `GET/POST/PUT /api/bookings`
- `GET/POST/PUT /api/sessions`
- `GET /api/sessions/{id}/editor`
- `POST /api/sessions/{id}/notes`
- `GET/POST/PUT /api/notes`
- `GET /api/dashboard/overview`

## Seed Data

On first startup, sample patients/bookings/sessions/notes are seeded automatically.

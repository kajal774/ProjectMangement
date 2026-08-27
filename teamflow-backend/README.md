# TeamFlow — Backend

Spring Boot API for TeamFlow. Implements the exact contract the
`teamflow-frontend` project expects: JWT auth (register/login) and
project CRUD, scoped per user.

## Stack

- **Java 17**
- **Spring Boot 3.3** (Web, Data JPA, Security, Validation)
- **PostgreSQL** — via Docker Compose for local dev
- **JJWT** — JWT creation/parsing
- **Maven**

## Architecture

```
Controller  ->  Service  ->  Repository  ->  Database
(HTTP layer)   (business      (Spring Data     (Postgres)
                logic)         JPA)
```

```
src/main/java/com/teamflow/
  auth/            AuthController, AuthService, dto/ (Login/Register/AuthResponse)
  project/         ProjectController, ProjectService, dto/, Project entity, ProjectStatus
  user/            User entity, UserRepository
  security/        JwtService, JwtAuthenticationFilter, CurrentUserProvider
  config/          SecurityConfig (auth rules, CORS, password hashing)
  exception/       GlobalExceptionHandler (turns exceptions into JSON error responses)
```

## Getting started

### 1. Install prerequisites

- [Java 17+](https://adoptium.net/)
- [Maven](https://maven.apache.org/install.html) (or use your IDE's built-in Maven)
- [Docker](https://www.docker.com/) (for the local Postgres database)

### 2. Start the database

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with a database called
`teamflow`, user/password `teamflow`/`teamflow` (see `docker-compose.yml`).

### 3. Run the app

```bash
mvn spring-boot:run
```

Or, in an IDE (IntelliJ, VS Code with the Java extension): open the
project and run `TeamflowApplication.main()`.

The API starts on **http://localhost:8080**. On first startup,
Hibernate automatically creates the `users` and `projects` tables
(`spring.jpa.hibernate.ddl-auto: update` in `application.yml`).

### 4. Verify it's working

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"password123"}'
```

You should get back a JSON response with a `token` and a `user`
object. Copy the token and try:

```bash
curl http://localhost:8080/api/projects \
  -H "Authorization: Bearer <paste-token-here>"
```

This should return `[]` (an empty list — no projects yet).

### 5. Connect the frontend

The frontend's `.env` already points at `http://localhost:8080/api`
by default, so once this is running you can `npm run dev` the
frontend and register/log in for real.

## Configuration

All config is in `src/main/resources/application.yml`, with every
value overridable via environment variable:

| Variable              | Default (local dev)                              | Purpose                          |
|------------------------|---------------------------------------------------|-----------------------------------|
| `DB_URL`               | `jdbc:postgresql://localhost:5432/teamflow`       | Database connection string        |
| `DB_USERNAME`          | `teamflow`                                        | Database user                     |
| `DB_PASSWORD`          | `teamflow`                                        | Database password                 |
| `JWT_SECRET`           | a placeholder dev value                            | Signing key for JWTs — **override this in any real deployment** |
| `JWT_EXPIRATION_MS`    | `86400000` (24 hours)                              | How long a token stays valid      |
| `CORS_ALLOWED_ORIGIN`  | `http://localhost:5173`                            | Which frontend origin can call this API |

## The JWT flow, end to end

```
Login page (frontend)
  -> POST /api/auth/login {email, password}
  -> AuthController -> AuthService
  -> Spring Security's PasswordEncoder checks the password against
     the stored BCrypt hash
  -> JwtService signs a token containing the user's email + expiry
  -> AuthResponse {token, user} returned as JSON
  -> Frontend stores the token (localStorage) and attaches it as
     "Authorization: Bearer <token>" on every future request

Any request to /api/projects/**
  -> JwtAuthenticationFilter runs first (before the controller)
  -> reads the Authorization header, validates the token's signature + expiry
  -> looks up the User by the email inside the token
  -> populates Spring Security's SecurityContext with that identity
  -> ProjectController -> ProjectService reads "who is this?" via
     CurrentUserProvider and scopes all queries to that user's own projects
```

401 vs 403, for interview purposes: this API only ever returns 401
(Unauthorized) for a missing/invalid/expired token, and 404 (not 403)
when you try to access another user's project — returning 404 instead
of 403 avoids confirming to an attacker that a project with that id
exists at all.

## Running tests

```bash
mvn test
```

Tests run against an in-memory H2 database (`src/test/resources/application.yml`),
not your real Postgres — so `mvn test` works even without Docker
running. Right now there's only a context-load smoke test
(`TeamflowApplicationTests`); see "What to extend first" below.

## What to extend first

1. **Real tests.** There's currently one smoke test. Add
   `@WebMvcTest` tests for `ProjectController` (mocking `ProjectService`)
   and a `ProjectServiceTest` with a mocked `ProjectRepository` — that
   pairing (controller test + service test) is a very common interview
   topic.
2. **Migrations.** `ddl-auto: update` is convenient for a prototype but
   risky long-term (Hibernate guesses at schema changes). Swap in
   Flyway or Liquibase with versioned SQL migration files.
3. **Project members.** The original design called for a
   `ProjectMember` join table so projects can have more than one
   collaborator, not just a single owner. That's the natural next
   entity/relationship to add — a many-to-many between `User` and
   `Project` via an explicit join entity (so you can attach a `role`
   column later).
4. **Refresh tokens.** Right now a JWT is valid for 24 hours with no
   way to revoke it early. A refresh-token flow (short-lived access
   token + longer-lived refresh token) is the standard next step.
5. **Rate limiting on /api/auth/\*\*.** Nothing currently stops repeated
   login attempts — worth adding before this goes anywhere near the
   public internet.

## What I learned (for interview prep)

**Spring:** constructor-based dependency injection everywhere (no
`@Autowired` field injection), `@RestControllerAdvice` as a single
place to turn exceptions into HTTP responses, why the controller layer
stays thin.

**Spring Security:** stateless JWT auth vs session/cookie auth,
`OncePerRequestFilter` and where a custom filter sits in the chain,
`SecurityContextHolder` as the per-request "who is this" storage.

**JPA/Hibernate:** `@ManyToOne`/`FetchType.LAZY` and why eager fetching
by default is a trap, `@Enumerated(EnumType.STRING)` vs the default
ordinal storage, how Spring Data derives queries from method names.

**Security concepts:** BCrypt hashing (one-way, salted, deliberately
slow) vs encryption, why passwords are never stored or compared in
plain text, 401 vs 403 and why this API prefers 404 for
cross-user access attempts.

**Likely interview questions:**
1. Why hash passwords with BCrypt instead of, say, SHA-256?
2. Walk me through what happens between a browser sending a request
   and `ProjectController` receiving it.
3. Why is the JWT filter registered `addFilterBefore` the username/
   password filter?
4. What's the difference between the `Project` entity and
   `ProjectResponse` DTO, and why not just return the entity directly?
5. Why does `getProjects` take a `String statusFilter` instead of a
   `ProjectStatus` directly, and where does invalid input get handled?

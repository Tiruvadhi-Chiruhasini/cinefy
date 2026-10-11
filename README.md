# Cinefy

**Cinefy: Movie User Analytics and Personalized Recommendation Dashboard**
*Discover. Analyze. Recommend.*

Cinefy is a full-stack web app that combines movie browsing, user ratings, personalized recommendations and analytics dashboards. React talks to a Spring Boot REST API through Axios, and the API stores everything in PostgreSQL.

> **Demo status.** This is a demonstration version. There is **no login**, and the write endpoints (add/edit/delete movies, submit ratings) are open. Add authentication (for example Spring Security with JWT) before using it with real users. All sample movies, users and ratings are **fictional sample data** created by the seeder.

---

## 1. Features

- **Dashboard**: totals, average rating, top-rated and most popular movies, genre and rating charts, recently added movies, and a compact recommendation list. All numbers come from the backend.
- **Movies**: grid with search by title, genre filter, sorting (title, year, rating, popularity), pagination, and add/edit/delete.
- **Movie details**: description, average rating and count, rating control, related movies.
- **Users**: searchable list, details, rating history, and preferred genres derived from real ratings. No passwords or sensitive fields exist.
- **Recommendations**: pick a user, see their favourite genres and unrated movies ranked with a short explanation.
- **Analytics**: genre counts, rating distribution, highest rated, most rated, monthly rating trends, genre filter.
- Loading, empty and error states on every screen; responsive layout; keyboard-accessible controls.

## 2. Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, React Router 6, Tailwind CSS 3, Axios, Recharts, Lucide React |
| Backend | Java 17, Spring Boot 3.3.5, Maven, Spring Web, Spring Data JPA (Hibernate 6), Validation, Actuator, Lombok (entities only) |
| Database | PostgreSQL (H2 in-memory is used only by the automated tests) |

## 3. Architecture

```mermaid
flowchart LR
    U[Browser] -->|HTTPS| FE[React app<br/>Vite build on Vercel or Netlify]
    FE -->|Axios + VITE_API_BASE_URL| API[Spring Boot REST API<br/>/api/...]
    API --> SVC[Services<br/>Movie, User, Rating,<br/>Analytics, Recommendation]
    SVC --> ENG[RecommendationEngine<br/>content-based scoring]
    SVC --> REPO[Spring Data JPA repositories]
    REPO --> DB[(PostgreSQL<br/>users, movies, ratings)]
    SEED[DataSeeder<br/>runs only on empty DB] --> REPO
    HC[/actuator/health/] --> API
```

## 4. Folder structure

```
cinefy/
  README.md  .gitignore  .env.example  docker-compose.yml
  scripts/start-backend.ps1        Loads .env and starts the backend (Windows PowerShell)
  docs/schema.sql                  Reference SQL schema
  docs/Cinefy.postman_collection.json
  cinefy-backend/
    pom.xml  Dockerfile
    src/main/java/com/cinefy/
      CinefyApplication.java
      config/        CorsConfig, DataSeeder
      controller/    Movie, User, Rating, Recommendation, Analytics controllers
      service/       business logic; service/recommendation = scoring engine
      repository/    Spring Data JPA repositories
      entity/        User, Movie, Rating
      dto/           request and response payloads
      exception/     global error handling
    src/main/resources/application.properties
    src/test/                       unit + integration tests
  cinefy-frontend/
    package.json  vite.config.js  tailwind.config.js  postcss.config.js  index.html
    vercel.json  netlify.toml  .env.example
    src/
      api/  components/  layouts/  pages/  hooks/  utils/  App.jsx  main.jsx  index.css
```

## 5. Prerequisites (Windows)

| Tool | Version | Check in PowerShell |
|---|---|---|
| JDK | 17 or newer (project targets 17) | `java -version` |
| Maven | 3.9+ (or use IntelliJ's bundled Maven) | `mvn -v` |
| Node.js | 20 LTS (18.18+ works) | `node -v` |
| PostgreSQL | 14+ (or Docker Desktop) | `psql --version` |
| Git | any recent | `git --version` |

Download links: adoptium.net (JDK), maven.apache.org, nodejs.org, postgresql.org, docker.com.

## 6. Database setup

Pick **one** option.

### Option A: Docker (easiest)

```powershell
Copy-Item .env.example .env
notepad .env          # set POSTGRES_PASSWORD and DB_PASSWORD to the same value
docker compose up -d
```

### Option B: PostgreSQL installed on Windows

```powershell
psql -U postgres -c "CREATE USER cinefy WITH PASSWORD 'choose_a_password';"
psql -U postgres -c "CREATE DATABASE cinefy OWNER cinefy;"
Copy-Item .env.example .env
notepad .env          # set DB_USERNAME=cinefy and DB_PASSWORD to your password
```

Tables are created automatically on first start (`DDL_AUTO=update`). `docs/schema.sql` shows the resulting schema.

**Sample data.** On the first start with an empty database, `DataSeeder` inserts 40 fictional movies, 18 users and 216 ratings. It uses a fixed random seed, skips itself when any data exists (so restarts never duplicate), and can be disabled with `SEED_ENABLED=false`. To reset: drop and recreate the database (or `docker compose down -v`), then start the backend again.

## 7. Run the backend

From the project root in PowerShell:

```powershell
.\scripts\start-backend.ps1
```

If PowerShell blocks the script, run once: `Set-ExecutionPolicy -Scope Process Bypass`.

Or set variables by hand and run Maven:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/cinefy"
$env:DB_USERNAME = "cinefy"
$env:DB_PASSWORD = "your_password"
cd cinefy-backend
mvn spring-boot:run
```

Check it works: open <http://localhost:8080/actuator/health> (should show `UP`) and <http://localhost:8080/api/movies>.

## 8. Run the frontend

In a second PowerShell window:

```powershell
cd cinefy-frontend
npm install
npm run dev
```

Open <http://localhost:5173>. In development the API address defaults to `http://localhost:8080`. To change it, copy `cinefy-frontend\.env.example` to `cinefy-frontend\.env.local` and edit `VITE_API_BASE_URL`.

Production build check: `npm run build` (output in `cinefy-frontend\dist`).

## 9. Tests

```powershell
cd cinefy-backend
mvn test
```

- `RecommendationEngineTest`: scoring rules, new users, movies with no ratings, score bounds.
- `RatingServiceTest`: duplicate prevention and missing records (Mockito).
- `ApiIntegrationTest`: runs the real app on in-memory H2 with sample data: health, movie list/search/filter, validation errors (400), not found (404), rating create/duplicate (409)/update/delete, analytics, recommendations.

Tests do not need PostgreSQL.

## 10. API reference and Postman

Import `docs/Cinefy.postman_collection.json` into Postman and set the collection variable `baseUrl`.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/movies` | `q`, `genre`, `sort` (title, year, rating, popularity), `dir` (asc, desc), `page`, `size` |
| GET | `/api/movies/{id}` | 404 if missing |
| GET | `/api/movies/genres`, `/api/movies/{id}/related` | helpers for the UI |
| POST / PUT / DELETE | `/api/movies`, `/api/movies/{id}` | validated; 201 / 200 / 204 |
| GET | `/api/users`, `/api/users/{id}` | `q`, `page`, `size`; detail includes preferred genres and ratings |
| GET | `/api/ratings` | filters `userId`, `movieId`, plus `page`, `size` |
| POST | `/api/ratings` | `{ "userId": 1, "movieId": 41, "rating": 4 }`; 409 if already rated |
| PUT / DELETE | `/api/ratings/{id}` | PUT body `{ "rating": 5 }` |
| GET | `/api/recommendations/{userId}` | `limit` |
| GET | `/api/analytics/overview`, `/genres`, `/ratings`, `/top-movies`, `/popular-movies` | `genre`, `limit`, `minRatings` where relevant |
| GET | `/actuator/health` | health check |

Example (PowerShell):

```powershell
Invoke-RestMethod http://localhost:8080/api/recommendations/1
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/ratings -ContentType "application/json" -Body '{"userId":1,"movieId":41,"rating":4}'
```

Errors look like `{ "status": 400, "message": "...", "fieldErrors": { "title": "Title is required." } }`. They never include stack traces or SQL.

## 11. How recommendations work

Implemented in `service/recommendation/ContentBasedRecommendationEngine.java`. It is rule-based scoring, **not** machine learning or collaborative filtering.

1. Group the user's ratings by genre and compute a genre affinity: `0.7 × (avg − 1) / 4 + 0.3 × (ratings in genre ÷ ratings in their most-rated genre)`.
2. Remove movies the user already rated.
3. For each remaining movie compute `quality` (Bayesian average of its ratings, pulled toward the global mean so one 5-star vote does not win, normalised to 0–1) and `confidence` (`ln(1+n) / ln(1+maxN)`).
4. `score = 0.50 × genreAffinity + 0.35 × quality + 0.15 × confidence`. Users with no ratings get `0.70 × quality + 0.30 × confidence`.
5. Return the top results with a plain-language reason.

The engine sits behind the `RecommendationEngine` interface, so a smarter algorithm can be added later without touching controllers.

## 12. Configuration reference

| Variable | Used by | Meaning |
|---|---|---|
| `DB_URL` | backend | JDBC URL, e.g. `jdbc:postgresql://localhost:5432/cinefy` |
| `DB_USERNAME`, `DB_PASSWORD` | backend | database credentials |
| `CORS_ALLOWED_ORIGINS` | backend | comma-separated allowed origins; wildcards such as `https://*.vercel.app` work |
| `SEED_ENABLED` | backend | `true` inserts sample data into an empty database |
| `DDL_AUTO` | backend | `update` (default) or `validate` |
| `PORT` | backend | set automatically by most hosts; default 8080 |
| `VITE_API_BASE_URL` | frontend | backend base URL, no trailing slash, no `/api` |

Nothing secret is committed. `.env` is git-ignored.

**Moving to Flyway later.** Add `flyway-core` and `flyway-database-postgresql` to `pom.xml`, copy `docs/schema.sql` to `src/main/resources/db/migration/V1__init.sql`, set `spring.flyway.baseline-on-migrate=true` and `DDL_AUTO=validate`, and add every future schema change as a new `V2__...sql` file.

## 13. Troubleshooting

| Problem | Fix |
|---|---|
| `Connection refused` / `Unable to obtain connection` | PostgreSQL is not running, or `DB_URL` host/port is wrong. Run `docker compose ps` or check the Windows service. |
| `password authentication failed` | `DB_USERNAME` / `DB_PASSWORD` do not match the database user. |
| `The server requested SSL` / `SSL required` | Managed databases need SSL. Add `?sslmode=require` to `DB_URL`. |
| `Port 8080 was already in use` | Set `$env:PORT = "8081"` and update `VITE_API_BASE_URL`. |
| Browser console shows a CORS error | Add the exact frontend origin to `CORS_ALLOWED_ORIGINS` (scheme + host, no trailing slash), restart the backend. |
| Frontend says "Cannot reach the server" | Backend not running, or `VITE_API_BASE_URL` is wrong. Restart `npm run dev` after editing env files. |
| Empty dashboard | The database is empty and `SEED_ENABLED=false`, or the seeder was skipped because data already existed. |
| `mvn` is not recognized | Install Maven and reopen PowerShell, or run from IntelliJ's Maven panel. |
| `release version 17 not supported` | Your JDK is older than 17. Install JDK 17+. |
| First request is very slow on free hosting | Cold start (see Deployment). Wait about a minute and retry. |

## 14. Upload to GitHub

```powershell
cd path\to\cinefy
git init
git add .
git status            # confirm .env is NOT listed
git commit -m "Initial commit: Cinefy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cinefy.git
git push -u origin main
```

Create the empty repository on github.com first (no README or .gitignore). If a secret was ever committed, rotate it; deleting the file is not enough.

## 15. Deployment

Free tiers change often. These constraints were checked in October 2026 and may be out of date, so confirm on each provider's pricing page.

| Piece | Suggested host | Constraint to know |
|---|---|---|
| Database | Neon (managed PostgreSQL) | Free plan: 0.5 GB storage and 100 compute-hours per project per month; compute suspends after 5 minutes idle and wakes on the next query. |
| Backend | Render (Docker web service) | Free web services sleep after 15 minutes without traffic and take up to about a minute to wake. Render has no native Java runtime, so the included `Dockerfile` is used. Render's own free Postgres expires after 30 days, so use Neon instead. |
| Frontend | Vercel or Netlify | Static hosting; both have free plans. |

Alternatives for the Java backend (check current free options): Railway, Fly.io, Koyeb, or any VPS running the Docker image.

### Step 1: database on Neon

1. Create a project at neon.com and copy the connection string. It looks like `postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require`.
2. Convert it to Spring settings. These are different formats:
   - `DB_URL` = `jdbc:postgresql://HOST/DBNAME?sslmode=require`
   - `DB_USERNAME` = `USER`
   - `DB_PASSWORD` = `PASSWORD`
3. If you see prepared-statement errors with Neon's pooled connection string, use the direct (non-pooled) connection instead.

### Step 2: backend on Render

1. Push the project to GitHub (section 14).
2. Render dashboard: **New → Web Service**, connect the repository.
3. Settings: **Language: Docker**, **Root Directory: `cinefy-backend`** (the Dockerfile builds with Maven, so no build or start command is needed).
4. Environment variables: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `CORS_ALLOWED_ORIGINS` (set a placeholder now, fix in step 4), optionally `SEED_ENABLED=true` for the first deploy.
5. Health check path: `/actuator/health`.
6. After deploy, test `https://YOUR-SERVICE.onrender.com/actuator/health` and `/api/movies`.

Without Docker (other hosts): build `mvn -DskipTests package`, start `java -jar target/cinefy-backend-1.0.0.jar`.

### Step 3: frontend on Vercel (Netlify is similar)

1. **Add New → Project**, import the repository.
2. **Root Directory: `cinefy-frontend`**, Framework Preset: Vite, Build Command `npm run build`, Output Directory `dist`.
3. Environment variable: `VITE_API_BASE_URL` = `https://YOUR-SERVICE.onrender.com`.
4. Deploy. `vercel.json` / `netlify.toml` already contain the single-page-app rewrite so refreshing `/movies/3` works.

`VITE_` variables are baked in at build time: after changing one, redeploy the frontend.

### Step 4: connect them (CORS)

Set the backend variable `CORS_ALLOWED_ORIGINS` to your real frontend URL, for example `https://cinefy.vercel.app` (no trailing slash). For preview deployments you can add `https://*.vercel.app`. Redeploy or restart the backend.

### Step 5: test the deployed app

1. Open the backend `/actuator/health`, then `/api/analytics/overview`.
2. Open the frontend: the dashboard should show counts and charts.
3. Rate a movie, refresh, and confirm it persisted.
4. Open a deep link such as `/movies/3` directly.

### Common deployment fixes

- **Cold starts**: the first request after idle can take about a minute on free hosting. The frontend waits up to 60 seconds. Paid always-on plans remove the delay.
- **SSL error from the database**: add `?sslmode=require` to `DB_URL`.
- **CORS error**: origin mismatch, including `http` vs `https` or a trailing slash. Fix `CORS_ALLOWED_ORIGINS`.
- **Frontend calls `localhost`**: `VITE_API_BASE_URL` was not set before the build. Set it and redeploy.
- **Out-of-memory on a small instance**: the Dockerfile sets `-Xmx384m`; adjust with the `JAVA_OPTS` variable.

> Deployment has **not** been performed for this project. The steps above are instructions for you to follow.

## 16. Known limitations

- No authentication or authorization; public write endpoints (see the demo notice above).
- Movie list sorting and pagination run in memory after filtering. This is fine for hundreds of movies; move to database-level sorting for much larger catalogs.
- Hibernate `update` schema management is for development; use Flyway for production.
- Poster URLs are optional; without one, a typographic placeholder is drawn (no image files or paid image APIs).

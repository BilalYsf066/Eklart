# Eklart — Run & Build

This repository contains a Laravel 12 backend and a React + Vite frontend. Two ways to run it are provided: Docker (recommended) and manual (local host tools / XAMPP). Below are the concise steps to build and run the project.

**Prerequisites**
- Docker & docker-compose (or Docker with `docker compose`)
- OR: PHP 8.2+, Composer, Node 18+, npm, and a database (MySQL or SQLite)

**Quick — Docker (recommended)**
- Build and start services:
  ```bash
  docker compose up --build
  ```
- Services and default ports:
  - Backend (Laravel dev server): http://localhost:8000
  - Frontend (Vite): http://localhost:5173
  - MySQL: 3306 (container `db`)

- Common container commands:
  - Run artisan inside backend container:
    ```bash
    docker compose exec app php artisan migrate --force
    docker compose exec app php artisan db:seed --class=AdminSeeder
    docker compose exec app php artisan key:generate --force
    ```
  - Run a single seeder (example):
    ```bash
    docker compose exec app php artisan db:seed --class="Database\\Seeders\\AdminSeeder"
    ```
  - Stop and remove containers:
    ```bash
    docker compose down
    ```

**Manual (no Docker)**
- Backend:
  ```bash
  cd backend
  composer install
  cp .env.example .env
  # Edit .env DB settings if needed
  php artisan key:generate
  # If using sqlite
  touch database/database.sqlite
  php artisan migrate --force
  php artisan db:seed --class=AdminSeeder
  npm install
  npm run dev    # starts Vite if backend serves assets via Vite
  ```
- Frontend (standalone):
  ```bash
  cd frontend
  npm install
  npm run dev    # open http://localhost:5173
  npm run build  # production bundle
  ```

**If you see the default Laravel welcome page**
- Laravel's default welcome page is served by the backend at `/`. If your app is an SPA served by the frontend, open the frontend dev server at `http://localhost:5173`.
- Ensure backend has migrations run and the correct routes; check backend logs:
  ```bash
  docker compose logs app --tail=200
  ```

**Switching to SQLite (local dev)**
- In `backend/.env` set:
  ```text
  DB_CONNECTION=sqlite
  DB_DATABASE=database/database.sqlite
  ```
- Then `touch backend/database/database.sqlite` and run migrations.

**Files to review**
- Docker orchestration: `docker-compose.yml`
- Backend env example: `backend/.env.example`

**Troubleshooting**
- If artisan class not found when seeding, run `composer dump-autoload` in `backend`.
- If ports conflict (8000 or 5173), stop the conflicting service or change ports in `docker-compose.yml`.
- If Docker is not installed, install it for your OS (Ubuntu, Fedora, macOS, Windows). I can provide exact commands if needed.

If you want, I can now run `docker compose up --build` here (if Docker is available) and check logs and the two web URLs for you.

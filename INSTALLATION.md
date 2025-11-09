## Getting Started

This is an Nx monorepo containing two applications:
- apps/api — NestJS backend (listens on http://localhost:3000 by default)
- apps/frontend — Angular app (served on http://localhost:4200 by default)

### Prerequisites
- Node.js 20.x (recommended) and npm 10+
- macOS/Linux/Windows supported

Check versions:
```bash
node -v
npm -v
```

### 1) Install dependencies
From the repository root:
```bash
npm install
```

### 2) Run in development
You can run each app in its own terminal, or run both concurrently via Nx.

Option A — two terminals:
```bash
# Terminal 1: start the API (http://localhost:3000/api)
npx nx serve api

# Terminal 2: start the Frontend (http://localhost:4200)
npx nx serve frontend
```

Option B — run both in parallel (one command):
```bash
npx nx run-many -t serve --projects=api,frontend --parallel
```

Then open the app:
- Frontend UI: http://localhost:4200
- API base URL: http://localhost:3000/api

CORS is open in development (`*`). In production it requires `FRONTEND_URL`.

### 3) Production builds
Build optimized artifacts:
```bash
# Frontend production build -> dist/apps/frontend
npx nx build frontend

# API production build -> dist/apps/api
npx nx build api
```

Serve the built frontend locally (static server):
```bash
npx nx serve-static frontend
# Serves dist/apps/frontend/browser as a SPA
```

Run the API production build:
```bash
# Default PORT is 3000; you can override via PORT=xxxx
env PORT=3000 node dist/apps/api/main.js
```

### Environment variables
- PORT — API port (default: 3000)
- NODE_ENV — `development` or `production`
- FRONTEND_URL — required in production for CORS allowlist (e.g. `https://your-domain`)

Set inline when starting, e.g.:
```bash
FRONTEND_URL=http://localhost:4200 NODE_ENV=production PORT=3000 node dist/apps/api/main.js
```

### Testing & Linting
```bash
# Run unit tests for a project
npx nx test api
npx nx test frontend

# Lint a project
npx nx lint api
npx nx lint frontend
```

### Troubleshooting
- If Nx cache or processes get stuck, reset:
```bash
npx nx reset
```
- If ports are in use: stop previous dev servers or change `PORT` for the API; Angular dev server defaults to 4200, change with `--port=4300`:
```bash
npx nx serve frontend --port=4300
```
- Angular CLI commands may not work directly in this workspace; prefer `nx` targets as shown above.

---

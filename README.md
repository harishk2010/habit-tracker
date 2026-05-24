# 🔥 HabitForge — Full Stack Habit Tracker

A production-ready **Habit Formation Web Application** built with a clean modular monolith architecture, class-based design, dependency injection, and generic repository pattern.

---

## 🏗️ Architecture

```
habit-tracker/
├── backend/          # Node.js + Express + TypeScript + MongoDB
├── frontend/         # React + TypeScript + Tailwind CSS
└── .github/
    └── workflows/
        └── deploy.yml  # CI/CD — auto deploy frontend to Vercel on push to main
```

### Backend Architecture
```
Flow: Route → Controller → Service → Repository → MongoDB

src/
├── config/
│   ├── db.ts                        # MongoDB connection
│   └── dependencyInjector.ts        # Manual DI wiring
├── controllers/                     # HTTP request/response only
│   ├── interfaces/                  # Controller contracts
│   ├── auth/, habit/, dashboard/, profile/
├── services/                        # Business logic
│   ├── interfaces/                  # Service contracts
│   ├── auth/, habit/, dashboard/, profile/
├── repositories/                    # All DB queries
│   ├── GenericRepository.ts         # Generic base with CRUD
│   ├── interfaces/                  # Repository contracts
│   └── user/, habit/, habitLog/
├── models/                          # Mongoose schemas
├── middlewares/
│   ├── authMiddleware.ts            # JWT + refresh token auto-rotation
│   ├── rateLimiter.ts               # Express rate limiting (global + auth)
│   ├── validateMiddleware.ts        # express-validator
│   └── requestLogger.ts            # UUID request logging
├── routes/                          # Route definitions
├── utils/
│   ├── ApiResponse.ts               # Standard response wrapper
│   ├── constants.ts                 # All string messages
│   ├── enums.ts                     # Status codes, roles
│   ├── jwt.ts                       # Token generation/verification
│   ├── logger.ts                    # Winston logger
│   └── streakCalculator.ts          # Streak logic
└── index.ts                         # App bootstrap + global error handler
```

### Key Backend Patterns
- **Generic Repository** — Base class with `create`, `findById`, `findOne`, `findAll`, `update`, `updateOne`, `delete`, `deleteMany`, `count`, `exists`
- **Interface-driven** — Every layer has an interface (e.g. `IHabitService`, `IHabitRepository`) following the **Dependency Inversion Principle**
- **Constructor-based DI** — All classes receive dependencies via constructor, wired through a central `dependencyInjector.ts`
- **Global Error Handler** — Catches all thrown errors, formats response uniformly — no try/catch in repositories or services
- **JWT Dual Token** — Access token (15m) + Refresh token (7d), both in HttpOnly cookies with auto-refresh middleware

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### Backend Setup

```bash
cd backend
npm install

# Copy env file and fill in values
cp .env.example .env
```

**`.env` variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your_super_long_secret_key_here_at_least_32_chars
JWT_REFRESH_SECRET=another_super_long_refresh_secret_here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=info
```

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

Backend runs on: `http://localhost:5000`  
Health check: `http://localhost:5000/health`

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

> The Vite dev server proxies `/api` requests to `http://127.0.0.1:5000`, so no CORS issues in development.

---

## 🔄 CI/CD Pipeline

Frontend is automatically deployed to Vercel on every push to `main` via GitHub Actions.

### Workflow — `.github/workflows/deploy.yml`

```yaml
name: Deploy Frontend to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./frontend
```

### Required GitHub Secrets

| Secret | How to get it |
|--------|---------------|
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Run `vercel link` locally → check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same `.vercel/project.json` file |

### Frontend `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🌐 Live Deployments

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://habit-tracker-five-liart.vercel.app |
| Backend API (Railway) | https://habit-tracker-production-k.up.railway.app |
| Health Check | https://habit-tracker-production-k.up.railway.app/health |

---

## 📡 API Documentation

All responses follow this format:
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Auth Routes — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, returns cookies |
| POST | `/logout` | ✅ | Clear auth cookies |
| POST | `/refresh` | ❌ | Refresh access token |
| GET | `/me` | ✅ | Get current user |

### Habit Routes — `/api/habits`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all user habits with today's completion status |
| POST | `/` | Create a habit |
| GET | `/:id` | Get single habit |
| PUT | `/:id` | Update habit |
| DELETE | `/:id` | Delete habit + all logs |
| PATCH | `/:id/toggle` | Toggle today's completion (handles streak) |
| GET | `/:id/logs` | Get all completion logs |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Full dashboard: stats, weekly chart, streaks |

### Profile — `/api/profile`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get profile |
| PUT | `/` | Update name/avatar |
| PATCH | `/password` | Change password |

---

## 🗄️ Database Schema

### User
```
_id, name, email (unique), password (bcrypt), avatar, role, createdAt, updatedAt
```

### Habit
```
_id, userId (ref User), title, description, frequency (daily|weekly),
targetDays ([0-6]), color, icon, category, currentStreak, longestStreak,
totalCompletions, isActive, createdAt, updatedAt
Indexes: { userId, isActive }
```

### HabitLog
```
_id, habitId (ref Habit), userId (ref User), completedAt, note, createdAt
Indexes: { habitId, completedAt }, { userId, completedAt }
```

---

## 🚢 Deployment

### Railway (Backend + MongoDB)

1. Push `backend/` to a GitHub repo
2. Create new Railway project → Deploy from GitHub
3. Add MongoDB plugin in Railway
4. Set environment variables in Railway dashboard
5. Railway auto-detects Node.js and runs `npm start`

### Vercel (Frontend)

1. Push `frontend/` to GitHub
2. Run `vercel link` locally to get `orgId` and `projectId`
3. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` to GitHub secrets
4. Push to `main` — GitHub Actions handles the rest automatically

---

## ✨ Features

- **Auth** — Register, Login, Logout, JWT refresh token rotation, profile management
- **Habits** — Full CRUD, daily/weekly frequency, custom icons/colors/categories
- **Streak Tracking** — Auto-calculate current streak, longest streak on every toggle
- **Dashboard** — Real-time stats, 7-day bar chart, top streak leaderboard
- **Security** — Helmet, CORS, rate limiting (global + auth routes), input validation, bcrypt password hashing
- **CI/CD** — GitHub Actions pipeline auto-deploys frontend to Vercel on push to main
- **Responsive** — Full mobile support with collapsible navigation
- **UX** — Loading states, error states, toast notifications, animated transitions

---

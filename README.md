# 🔥 HabitForge — Full Stack Habit Tracker

A production-ready **Habit Formation Web Application** built with a clean modular monolith architecture, class-based design, dependency injection, and generic repository pattern.

---

## 🏗️ Architecture

```
habit-tracker/
├── backend/          # Node.js + Express + TypeScript + MongoDB
└── frontend/         # React + TypeScript + Tailwind CSS
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
│   ├── authMiddleware.ts            # JWT + refresh token
│   ├── rateLimiter.ts               # Express rate limiting
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
- **Interface-driven** — Every layer has an interface (e.g. `IHabitService`, `IHabitRepository`)
- **Class-based DI** — All classes receive dependencies via constructor injection
- **Global Error Handler** — Catches all thrown errors, formats response uniformly
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

> The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no CORS issues in development.

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

1. Push `frontend/` to a GitHub repo
2. Import in Vercel, set framework to **Vite**
3. Add env variable: `VITE_API_URL=https://your-railway-backend.up.railway.app`
4. Update `vite.config.ts` proxy target for production

---

## ✨ Features

- **Auth** — Register, Login, Logout, JWT refresh token rotation, profile management
- **Habits** — Full CRUD, daily/weekly frequency, custom icons/colors/categories
- **Streak Tracking** — Auto-calculate current streak, longest streak on every toggle
- **Dashboard** — Real-time stats, 7-day bar chart, top streak leaderboard
- **Security** — Helmet, CORS, rate limiting (global + auth routes), input validation, bcrypt password hashing
- **Responsive** — Full mobile support with collapsible navigation
- **UX** — Loading states, error states, toast notifications, animated transitions

---

## 📁 Evaluation Checklist

| Requirement | Status |
|-------------|--------|
| User Auth (register/login/logout/JWT) | ✅ |
| Secure password hashing (bcrypt x12) | ✅ |
| Profile management | ✅ |
| Create/Edit/Delete habits | ✅ |
| Daily/Weekly goals | ✅ |
| Mark habits as completed (toggle) | ✅ |
| Streak count tracking | ✅ |
| Dashboard with stats | ✅ |
| Weekly progress chart | ✅ |
| React + responsive design | ✅ |
| Reusable components | ✅ |
| Loading/error states | ✅ |
| RESTful APIs | ✅ |
| Input validation | ✅ |
| Global error handling | ✅ |
| MongoDB schema design | ✅ |
| Query indexing | ✅ |
| Protected routes | ✅ |
| Environment variables | ✅ |
| Clean architecture (Repository Pattern + DI) | ✅ |

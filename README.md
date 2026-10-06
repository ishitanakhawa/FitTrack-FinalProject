# FitTrack – Fitness Tracker & Workout Planner

B.Tech CSE Case Study 81 – Backend Development (Node.js, Express.js & MongoDB) with React frontend demo.

Users can register/login, log workouts with personal records, create/follow workout plans, track weight/BMI with progress photos, view weekly/monthly analytics, and receive FCM reminders.

## Project Structure

```
Backend_FinalProject/
  fittrack-backend/   # Node + Express REST API (main project)
  fittrack-frontend/  # React + Vite demo UI
```

## Features

- JWT + Firebase Auth sync on register/login (`firebaseUid` / `firebaseToken`)
- Workouts CRUD with ownership check + personal records
- Plans: create, list, search `?keyword=`, get one, follow
- Metrics: weight/height with server-side BMI + progress photo upload
- Analytics weekly/monthly summary
- FCM reminders (`PUT /api/users/fcm-token`, `POST /api/reminders/send`)
- Postman docs in `fittrack-backend/docs/`

## Tech Stack

Backend: Node.js, Express.js ^5.2.1, Mongoose ^9.10.3, jsonwebtoken, bcryptjs, firebase-admin, multer, express-validator, cors, dotenv
Frontend: React ^19.3.0, Vite ^8, react-router-dom, recharts, fetch API

## Prerequisites

- Node.js LTS + npm
- MongoDB running locally or Atlas
- Firebase project + `serviceAccountKey.json` (for Auth + FCM)

## Setup – Backend

```bash
cd Backend_FinalProject/fittrack-backend
npm install
cp .env.example .env
# edit .env:
# PORT=5001
# MONGO_URI=mongodb://127.0.0.1:27017/fittrack
# JWT_SECRET=change_this_secret
# put serviceAccountKey.json in this folder (git-ignored)
npm run dev
# check http://localhost:5001
```

## Setup – Frontend

```bash
cd Backend_FinalProject/fittrack-frontend
npm install
npm start
# open http://localhost:3000 (Vite, entry src/main.jsx)
# api base is hardcoded to http://localhost:5001 in src/api.js
```

Keep both running. Register on frontend, token is saved to localStorage.

## API Endpoints

| Area | Method and URL |
|------|----------------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Workouts | `GET /api/workouts`, `GET /api/workouts/:id`, `POST /api/workouts`, `PUT /api/workouts/:id`, `DELETE /api/workouts/:id` |
| Plans | `POST /api/plans`, `GET /api/plans`, `GET /api/plans/search?keyword=strength`, `GET /api/plans/:id`, `POST /api/plans/:id/follow` |
| Metrics | `POST /api/metrics`, `GET /api/metrics/user/:id`, `POST /api/metrics/:id/photo` (form field `photo`) |
| Analytics | `GET /api/analytics/summary?period=weekly` or `monthly` |
| Reminders | `PUT /api/users/fcm-token`, `POST /api/reminders/send` |

Protected routes need `Authorization: Bearer <token>`.

## API Documentation

Import into Postman:
- `fittrack-backend/docs/Fittrack.postman_collection.json`
- `fittrack-backend/docs/FitTrack.postman_environment.json` (set `baseUrl=http://localhost:5001`)

## Example User Flow

1. `POST /api/auth/register` – create account
2. `POST /api/workouts` – log a session
3. `GET /api/metrics/user/:id` – view progress

## Notes

- Photos use local `uploads/` (served at `/uploads`). Firebase Storage needs billing, so swap is isolated to `fittrack-backend/utils/uploadPhoto.js`.
- `serviceAccountKey.json`, `.env`, `uploads/` are git-ignored.
- Deployment on Render/Heroku is bonus/pending.

# FitTrack - Fitness Tracker and Workout Planner API

Backend REST API built with Node.js, Express.js, MongoDB (Mongoose), JWT and Firebase.

## Features

- Register and login with JWT authentication + Firebase Auth sync (also creates Firebase user, returns `firebaseUid` / `firebaseToken`)
- Log, view, update and delete workouts (personal records supported)
- Create, list, search and follow workout plans
- Track weight and BMI over time
- Upload progress photos
- Weekly and monthly analytics summary
- Reminder notifications via Firebase Cloud Messaging (FCM)
- Postman API documentation

## Tech Stack

Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer, express-validator, Firebase Admin SDK

## Setup Instructions

1. Clone the repository and install packages:
```bash
   git clone <your-repo-url>
   cd fittrack-backend
   npm install
```
2. Copy `.env.example` to `.env` and fill in your values (`PORT`, `MONGO_URI`, `JWT_SECRET`).
3. Make sure MongoDB is running (local or Atlas).
4. Add your Firebase `serviceAccountKey.json` to the project root (required for Firebase Auth + FCM). The key is git-ignored and not included in this repository.
5. Start the server:
```bash
   npm run dev
```
6. Open `http://localhost:5001` to check it is running.

## API Documentation

- Postman collection and environment: `docs/` folder (import into Postman, set `baseUrl` to `http://localhost:5001`)

## API Endpoints

| Area | Method and URL |
|------|----------------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Workouts | `GET /api/workouts`, `GET /api/workouts/:id`, `POST /api/workouts`, `PUT /api/workouts/:id`, `DELETE /api/workouts/:id` |
| Plans | `POST /api/plans`, `GET /api/plans`, `GET /api/plans/:id`, `POST /api/plans/:id/follow`, `GET /api/plans/search?keyword=strength` |
| Metrics | `POST /api/metrics`, `GET /api/metrics/user/:id`, `POST /api/metrics/:id/photo` |
| Analytics | `GET /api/analytics/summary?period=weekly` or `monthly` |
| Reminders | `PUT /api/users/fcm-token`, `POST /api/reminders/send` |

Protected routes need the header `Authorization: Bearer <token>`.

## Example User Flow

1. `POST /api/auth/register` creates an account
2. `POST /api/workouts` logs a workout session
3. `GET /api/metrics/user/:id` shows progress over time

## Notes

- Progress photos are saved in the local `uploads/` folder. Firebase Storage needs a billing account, so the photo code is kept in `utils/uploadPhoto.js` and can be switched to Firebase Storage by changing only that file.
- Firebase Admin is used for Auth sync on register/login (`controllers/authController.js`), to verify Firebase ID tokens (`middleware/firebaseAuth.js`), and for FCM reminders (`controllers/reminderController.js`). The photo route accepts either a JWT or a Firebase token.
- Deployment on Render/Heroku is pending (bonus deliverable).
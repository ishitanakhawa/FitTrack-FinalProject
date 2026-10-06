# FitTrack Frontend – React + Vite

Student demo UI for the FitTrack backend (Case Study 81). Yellow/black theme matching reference cards.

## Tech Stack

React ^19.3.0, Vite ^8, react-router-dom ^7.18.4, recharts ^3.10.1, fetch API

## Structure

```
src/
  main.jsx          # Vite entry (mounts App)
  App.jsx           # Router + Private wrapper
  api.js            # BASE_URL=http://localhost:5001, JWT from localStorage
  components/Navbar.jsx
  context/ToastContext.jsx
  pages/Login.jsx, Register.jsx, Dashboard.jsx, Workouts.jsx, Plans.jsx, Metrics.jsx
index.html          # Root HTML → /src/main.jsx
vite.config.js      # dev port 3000, /api + /uploads proxy to :5001
public/             # favicon, logos, manifest
```

## Setup

```bash
cd Backend_FinalProject/fittrack-frontend
npm install
npm start
# open http://localhost:3000
# backend must run on http://localhost:5001
```

Other commands:
- `npm run dev` – same as start (Vite dev)
- `npm run build` – production build to `build/`
- `npm run preview` – preview production build

## Pages

- `/login`, `/register` – auth, saves `token`, `_id`, `name` to localStorage
- `/` – dashboard (weekly summary, charts, recent workouts)
- `/workouts` – add/delete sessions
- `/plans` – create/search/follow
- `/metrics` – weight/height + BMI + progress photo upload (`FormData photo` → `POST /api/metrics/:id/photo`)

## Notes

- Migrated from CRA to Vite. Old `src/index.js` / `public/index.html` template removed.
- Photos are local backend `uploads/`, shown via `photoUrl` full URL.

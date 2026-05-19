# Health Tracker

A simple full-stack health tracker app with a Node.js/Express backend and a React/Vite frontend.

## Project structure

- `backend/` - Express API, MongoDB connection, routes, and authentication middleware
- `frontend/` - React app built with Vite, includes login, dashboard, record list, and add-record form

## Setup

### Backend

1. Open a terminal in `health-tracker/backend`
2. Run `npm install`
3. Set `MONGO_URI` if you want to use a custom MongoDB connection URL
4. Run `npm run dev` to start the backend on port `5000`

### Frontend

1. Open a terminal in `health-tracker/frontend`
2. Run `npm install`
3. Run `npm run dev` to start the frontend on port `3000`

## Notes

- The backend route is protected with a simple bearer token: `Bearer health-token`
- The frontend uses a proxy to forward `/api` requests to `http://localhost:5000`
- Login is mocked and uses local storage for session tracking

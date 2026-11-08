# Fullstack Music Player

## Overview
This repository is a full-stack music player built around a React frontend and an Express + MongoDB backend. It fetches music data from the Jamendo API, exposes authenticated user flows, and gives the application a playlist, player, and user-profile experience.

## Problem statement
The project addresses the typical engineering challenge of turning a front-end UI into a real application with data ownership, authentication, and user-specific state. The codebase includes:

- backend-driven music discovery
- protected routes for authenticated users
- an editable user profile and secure password-reset flow
- favourites persisted per user
- a React player state that must stay consistent across components and route transitions

## Architecture and implementation
### Frontend
The frontend is built with React + Vite and contains a music dashboard with:

- sidebar navigation
- search and playlist views
- audio player controls
- authentication screens for sign-up, login, profile editing, and password reset
- Redux-based session state

### Backend
The backend is implemented in Express.js and exposes routes under `/api/auth` and `/api/songs`.

Key responsibilities:
- user registration and login
- JWT-based user authentication
- protected routes that verify user identity
- music catalog retrieval from Jamendo
- user favourites persistence in MongoDB
- avatar upload through ImageKit
- password reset via secure token generation and email delivery

### Repository history note
The local clone available in this workspace is shallow: the git history for this repository only exposes the current commit and the last message, `fix reset password token bug`. As a result, the engineering conclusions below are based on the live source code and that visible commit metadata rather than a long multi-commit evolution.

## Features actually implemented
- signup and login flow
- JWT-protected authenticated session handling
- `getMe` route for current-user retrieval
- forgot-password and reset-password flow
- user profile update with password change support
- avatar upload via ImageKit
- audio playback controls, including play/pause, previous, next, shuffle, loop, and mute
- fetching songs and playlist data from Jamendo
- saving and toggling favourites per user
- metadata-driven playlist selection using tags

## Technologies used
- React
- Vite
- Redux Toolkit
- React Router
- Axios
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- ImageKit
- Nodemailer
- Jamendo API

## Engineering challenges faced
### 1. Secure token handling for password reset
The code explicitly hashes reset tokens before storing them and hashes the incoming token again during verification. This is a concrete example of a security-sensitive issue and is consistent with the visible commit message: `fix reset password token bug`.

The critical logic is in `backend/controllers/authController.js`, where:
- a raw reset token is generated with `crypto.randomBytes(32).toString("hex")`
- the token is hashed before it is stored in MongoDB
- the same hashing step is performed when the frontend sends the reset link back
- the reset token is cleared after successful password update

This matters because storing raw reset tokens would be unsafe if a database were compromised.

### 2. Keeping authentication context consistent between frontend and backend
The frontend uses Redux to store session data and localStorage as a fallback, then rehydrates the user using the token in `App.jsx`. This is a practical challenge in full-stack apps because the client must preserve identity across refreshes and route changes without leaking invalid or stale sessions.

### 3. Protecting user-specific favourites
The favourites logic in `songController.js` checks whether a song already exists in the array, uses `String(fav.id) === String(song.id)` to normalize IDs, and keeps the list consistent without duplicates. This shows attention to real-world data inconsistency, especially when the API or database may return IDs as strings or numbers.

### 4. Decoupling backend APIs from client-side secrets
The backend fetches songs from Jamendo and the frontend only calls the backend. This avoids exposing API keys or third-party credentials in the browser.

### 5. Handling user profile and password updates carefully
The `editProfile` flow distinguishes between profile updates and password changes, verifies current password before changing it, and only changes fields present in the request. This is evidence of deliberate input validation and an awareness of edge cases.

## Important technical decisions
- JWT-based identity validation is used rather than storing the user in a browser-only session object.
- Favourites are persisted as part of the user document rather than in a separate table.
- Backend requests to Jamendo are centralized in the server so the client does not handle the external API directly.
- ImageKit is used for avatars rather than storing uploaded binary data directly in MongoDB.
- The reset flow stores only a hashed token, not the raw token, which is a security-minded design decision.

## Learning outcomes
- working across the React + Express + MongoDB stack end-to-end
- securing authenticated flows with JWT and token validation
- designing protected API layers and handling user-specific data safely
- integrating third-party services without exposing credentials
- keeping frontend state and backend state synchronized across route changes and reloads

## Installation and execution
### Backend
```bash
cd backend
npm install
```

Create a `.env` file with the following values:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

Then start:

```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_BASE_URL=http://localhost:5001
```

Then start:

```bash
npm run dev
```

## Screenshots
No repository screenshots are stored in this local snapshot. The repository instead documents the app through source structure, route layout, and UI logic.

## Repository information
- Repository: `fullstack-music-player`
- Stack: React + Express + MongoDB
- Primary focus: music discovery, playback, user auth, and personalization

# Where's Waldo Clone

## Overview

This project is a full-stack Where's Waldo style browser game built with Next.js. Players choose a map, search for hidden characters by clicking on the image, and try to finish as quickly as possible. Each run can be submitted to a leaderboard, where scores are ranked against other players for that specific map.

The application combines a React-based client experience with Next.js API routes, Prisma, PostgreSQL, Cloudinary, and JWT-based session handling. It also includes internal tooling for uploading new maps and defining hidden-character coordinates.

## Features

- Browse available maps from the home page
- Open individual levels through dynamic routes
- Click directly on map images to locate hidden characters
- Track active runs with a timer and split-style progress updates
- Complete a level and calculate a ranked finishing time
- Submit scores to a per-level leaderboard
- Progress to the next level after submission
- Create lightweight user sessions with JWT authentication
- Upload new maps with protected map-creation tooling
- Store uploaded images in Cloudinary and map metadata in PostgreSQL

## How the Game Works

1. A player opens the home page and selects a map.
2. The level page fetches the image and its hidden-character coordinate data.
3. If the user is logged in, the app creates a score entry when the level starts.
4. A timer begins running on the client.
5. The player clicks on the image to find characters such as Waldo, Wenda, Odlaw, and Wizard.
6. Each click is checked against stored coordinate ranges for the characters on that map.
7. When all characters are found, the run is completed and the final time is calculated.
8. The backend computes the player's rank for that map.
9. The player can submit the score and move to the next level.

## Tech Stack

### Frontend

- Next.js
- React
- Next Image
- CSS Modules

### Backend

- Next.js API routes
- Prisma ORM
- PostgreSQL
- Raw SQL for leaderboard and ranking queries

### Authentication

- JWT for lightweight user sessions
- Client-side auth state managed through a React context provider

### File and Media Handling

- Multer for multipart image uploads
- Cloudinary for hosted image storage

## Data Model

The application is built around three main entities.

### User

A user record stores:

- a unique id
- a unique username
- an expiration date
- related score entries

### Image

A map record stores:

- a unique id
- the map name
- serialized image metadata
- optional coordinate data for Waldo, Wenda, Odlaw, and Wizard
- related score entries

### Score

A score record stores:

- the user id
- the image id
- the time the run started
- the time the run finished
- whether the score was officially submitted

## Backend Responsibilities

### Image APIs

These routes handle:

- creating new maps
- fetching all maps
- fetching levels in sorted order
- fetching a specific map by id

### Game APIs

These routes handle:

- creating a score when a run starts
- completing a score when a level ends
- calculating a score's rank
- returning leaderboard data for a map
- marking a score as submitted

### User API

The user creation route:

- validates the username
- prevents duplicate usernames
- creates the user record
- signs and returns a JWT for the client

## Anti-Cheat Measures

The game uses a server-authoritative timing model to prevent players from submitting manipulated scores.

### Server-Side Timestamps

When a level begins, the backend creates a score record in the database with a `startedAt` timestamp set by the server, not the client. When the player completes the level, the client sends a request to the end-game API, which sets the `finishAt` timestamp — also server-side. The actual run duration is always computed as `finishAt - startedAt` from these two database values, which means the client timer displayed to the player is only cosmetic and has no influence over the recorded time.

This means:
- A player cannot fabricate a short completion time by sending a custom time value to the server
- Pausing or manipulating the visible client timer does not affect the actual score
- Any score submitted to the leaderboard reflects a duration that was entirely measured by the server

### Character Coordinates Never Exposed

The correct target coordinates for each character are stored in the database and are only accessed server-side during click validation. The client never receives the raw answer data, so players cannot read the coordinates from network responses to trivially locate characters.

### Scores Require an Explicit Submission Step

A completed score is not automatically counted on the leaderboard. The `submitted` field on the score record defaults to `false`. Only after the player explicitly confirms and submits does the score become eligible for leaderboard ranking. This prevents abandoned or incomplete runs from polluting the rankings.

## Leaderboard and Ranking Logic

Each map has its own leaderboard. Scores are ordered by the difference between finish time and start time, so lower completion times rank higher. Ranking is calculated in SQL using a window function, which keeps the logic efficient and map-specific.

Leaderboard queries join scores with users so the UI can display both the player's name and time for each run.

## Map Creation Tooling

The project includes an internal map creation workflow that allows new levels to be uploaded and configured.

This tooling supports:

- image upload
- image preview before submission
- click-based coordinate selection
- manual entry of character bounding coordinates
- saving the uploaded image and related metadata

Uploaded images are sent to Cloudinary, and the resulting asset metadata is stored in the database alongside the map configuration.

## Map Creation Access Toggle

The map creation tooling route and related API paths are blocked with `404` in production by default.

- Env flag: `ENABLE_MAP_CREATION_TOOLS`
- Default behavior in production: blocked
- To temporarily enable in production:

```bash
ENABLE_MAP_CREATION_TOOLS=true
```

Protected paths:

- `/map-creation`
- `/api/image/*`
- `/api/scores/*`

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in the browser.

## Environment Expectations

To run the full project locally, you will need environment variables for:

- PostgreSQL database access
- JWT signing
- Cloudinary credentials
- the optional map creation access toggle

## Project Summary

This Where's Waldo clone is a full-stack game project that combines interactive image-based gameplay with persistent score tracking, authentication, file uploads, and leaderboard ranking. It demonstrates practical use of Next.js, React, Prisma, PostgreSQL, Cloudinary, JWT-based auth, and protected internal tooling for content management.

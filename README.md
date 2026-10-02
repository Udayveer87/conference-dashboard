# Conference Dashboard — MongoDB Aggregation & Indexing

A learning project focused on MongoDB aggregation pipelines and indexing performance, with a small live dashboard.

## Tech Stack

- Node.js, Express, Mongoose (MongoDB)
- Chart.js (vanilla JS frontend, no framework)

## Features

- Seed script generating realistic conference registration data (200 attendees x 4 sessions x 3 days)
- Dashboard stats via aggregation (`$group`, `$project`, `$addToSet`, `$round`)
- Top-5 attendees by average rating
- Per-session analytics (avg/max/min rating)
- A compound index (`{ attendee_id: 1, day: 1 }`) with a runnable script that
  proves the index works, by comparing MongoDB's query planner stats
  (`explain('executionStats')`) for an indexed vs. a non-indexed query

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stats` | Aggregate dashboard totals (attendees, sessions, avg rating) |
| GET | `/api/attendee/:id/:day` | One attendee's sessions/ratings for a given day |
| GET | `/api/average/:id` | One attendee's average rating |
| GET | `/api/top` | Top 5 attendees by average rating |
| GET | `/api/session-analytics` | Avg/max/min rating per session |
| POST | `/api/add` | Add a registration record |

## Setup

```bash
npm install
cp .env.example .env
npm run seed        # populate demo data
npm run dev          # start the server (nodemon)
npm run test-index   # compare an indexed vs. non-indexed query plan
```

Dashboard: `http://localhost:3000`

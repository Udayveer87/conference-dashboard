# Conference Dashboard — MongoDB Aggregation & Indexing

A focused project on MongoDB aggregation pipelines and indexing, with a small live dashboard and a script that proves the compound index works.

## Screenshot

<img width="900" height="650" alt="conference-dashboard" src="https://github.com/user-attachments/assets/dfefbbe7-be61-458e-a97d-ba14dedce010" />

## Tech Stack

Node.js, Express, Mongoose (MongoDB) · Chart.js

## Features

- Dashboard stats via aggregation (`$group`, `$addToSet`, `$round`)
- Top-5 attendees by rating, per-session analytics
- `indexTest.js` — compares an indexed vs. non-indexed query using `explain('executionStats')`

## Setup

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
npm run test-index   # see the index actually working
```

Visit `http://localhost:3000`.

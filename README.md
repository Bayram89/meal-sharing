# Meal Sharing Copenhagen

Meal Sharing Copenhagen is a small full-stack app for finding and booking shared dining experiences in Copenhagen.

This started as a learning project, but I wanted it to feel more real. I worked on the design, cleaned up the content, and fixed the deployment so the app could stay live after the original database was lost.

## Live

- Frontend: [meal-sharing-front-end.onrender.com](https://meal-sharing-front-end.onrender.com/)
- API: [meal-sharing-egmm.onrender.com/api/meals](https://meal-sharing-egmm.onrender.com/api/meals)

## What you can do

- browse upcoming meals
- open a meal and see the details
- make a reservation
- leave a review
- search and sort meals

## Built with

- Next.js
- React
- Node.js
- Express
- Knex
- PostgreSQL

## A few things I improved

- changed the app from a very generic starter into something calmer and more believable
- replaced the basic sample meals with better portfolio content
- improved the booking pages and meal cards
- restored the app after the old free hosted database expired

## Run locally

Start the API:

```bash
cd api
npm install
npm run dev
```

Start the frontend:

```bash
cd app-next
npm install
npm run dev
```

Then open:

- [http://localhost:3000](http://localhost:3000)

## Notes

The PostgreSQL seed file used for recovery is here:

- [api/src/mealsharing.postgres.sql](./api/src/mealsharing.postgres.sql)

More detailed recovery notes are here:

- [api/RECOVERY.md](./api/RECOVERY.md)

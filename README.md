# Meal Sharing Copenhagen

Meal Sharing Copenhagen is a full-stack web application for discovering and booking shared dining experiences.

While it started as a learning project, I wanted it to feel closer to a real product. Beyond building the application itself, I continued refining the design, improving the content and user experience, and restoring the live deployment after the original database was lost. This gave me hands-on experience not only with development, but also with maintaining and improving a product after launch.

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

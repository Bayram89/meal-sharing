# Meal Sharing Recovery

The original free Render Postgres database for this project is no longer present in the Render dashboard, so the old hosted data cannot be recovered directly from Render.

The best surviving dataset in this repository is:

- `api/src/mealsharing.sql` for the original schema and seed content
- `api/src/mealsharing.postgres.sql` for a clean PostgreSQL import script derived from that data

## What was fixed

The API routes were updated to work cleanly with PostgreSQL instead of relying on MySQL-specific raw SQL.

Files updated:

- `api/src/routers/meals.js`
- `api/src/routers/reservations.js`
- `api/src/routers/reviews.js`

## Fastest restore path on Render

1. Create a new free Render Postgres database.
2. Open the database info page and copy:
   - host
   - port
   - database name
   - username
   - password
   - external database URL
3. Update the API service environment variables:
   - `DB_CLIENT=pg`
   - `DB_HOST=<host>`
   - `DB_PORT=5432`
   - `DB_USER=<username>`
   - `DB_PASSWORD=<password>`
   - `DB_DATABASE_NAME=<database name>`
   - `DB_USE_SSL=true`
4. Import the PostgreSQL seed file:

```powershell
$env:PGPASSWORD="<password>"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" `
  -h "<host>" `
  -p 5432 `
  -U "<username>" `
  -d "<database name>" `
  -f "C:\Users\Bayram\Projects\meal-sharing\api\src\mealsharing.postgres.sql"
```

You can also import with the external database URL:

```powershell
$env:PGPASSWORD="<password>"
Get-Content "C:\Users\Bayram\Projects\meal-sharing\api\src\mealsharing.postgres.sql" | `
  & "C:\Program Files\PostgreSQL\16\bin\psql.exe" "<external_database_url>"
```

5. Redeploy the `meal-sharing` API service.
6. If the API URL changes, update `NEXT_PUBLIC_API_URL` in the frontend service and redeploy `meal-sharing-front-end`.

## Expected recovered data

The PostgreSQL import recreates:

- 10 meals
- 5 reservations
- 10 reviews

This is only the data preserved in the repository SQL file. Any later production-only data that was never exported from Render is not present here.

# Phoenix Garage — Online deployment

Phoenix Garage is now **PostgreSQL-ready** while retaining SQLite as the local fallback.

## Local development

Without `DATABASE_URL`, the app continues to use the bundled SQLite database:

```bash
npm install
npm start
```

## Online production

Set the hosting provider's PostgreSQL connection string as `DATABASE_URL`. When present, the server automatically uses PostgreSQL for persistent data.

```bash
npm install
npm start
```

Health endpoint reports `database: postgresql` when the online database is active.

## Migrate existing local data

Create an empty PostgreSQL database and set its connection string:

```bash
export DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/DATABASE'
npm install
npm run migrate:postgres
```

This migrates users, vehicles, products, categories, orders, sessions, wishlist/cart data, messages, bookings, and B2B applications/companies/members from `data/phoenixgarage.db`.

## Security

Do not commit `.env` or real database credentials. Use the hosting provider's secret/environment-variable manager.

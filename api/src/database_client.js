import knex from "knex";

const connection = knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    ssl:
      process.env.DB_USE_SSL === "true" ? { rejectUnauthorized: false } : false,
    multipleStatements: true,
  },
  useNullAsDefault: true,
});

export const knexRawQuery = async (query, bindings) => {
  const result = await connection.raw(query, bindings);
  return result[0] || result?.rows || result;
};

export default connection;

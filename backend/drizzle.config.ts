import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'nexa_user',
    password: 'nexa_pass_123',
    database: 'nexa_db',
  },
  verbose: true,
  strict: true,
});

import { type Config } from 'drizzle-kit';

export default {
  schema: './node_modules/@katitb2024/database/dist/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: './node_modules/@katitb2024/database/drizzle',
  tablesFilter: ['*'],
} satisfies Config;
import { type Config } from 'drizzle-kit';

export default {
  schema: './node_modules/@katitb2024/database/dist/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://postgres:posgtres@localhost:5432/coba',
  },
  out: './node_modules/@katitb2024/database/drizzle',
  tablesFilter: ['*'],
} satisfies Config;
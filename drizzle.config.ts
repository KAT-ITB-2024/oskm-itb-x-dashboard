import { type Config } from 'drizzle-kit';

import { env } from '~/env';

export default {
  schema: './node_modules/@katitb2024/database/dist/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: './node_modules/@katitb2024/database/drizzle',
  tablesFilter: ['*'],
} satisfies Config;
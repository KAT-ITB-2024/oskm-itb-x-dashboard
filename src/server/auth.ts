import { DrizzleAdapter } from '@auth/drizzle-adapter';
import {
  type DefaultUser,
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from '~/env';
import { db } from '~/server/db';
import { users, type UserRole } from '@katitb2024/database';
import { type DefaultJWT } from 'next-auth/jwt';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { compare } from 'bcrypt';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      nim: string;
      role: UserRole;
    } & DefaultSession['user'];
  }
  interface User extends DefaultUser {
    nim: string;
    role: UserRole;
  }

  interface JWT extends DefaultJWT {
    nim: string;
    role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.nim = user.nim;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        nim: token.nim,
        role: token.role,
      },
    }),
  },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        nim: {
          label: 'NIM',
          type: 'text',
          placeholder: 'Gunakan NIM TPB Anda',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Gunakan password Anda',
        },
      },

      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Credentials are required',
            });
          }

          if (!credentials.nim) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'NIM is required',
            });
          }

          if (!credentials.password) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Password is required',
            });
          }

          const { nim, password } = credentials;

          const user = await db.query.users.findFirst({
            columns: {
              id: true,
              nim: true,
              role: true,
              password: true,
            },
            where: eq(users.nim, nim),
          });

          if (!user) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'User not found',
            });
          }

          const isValidPassword = await compare(password, user.password);

          if (!isValidPassword) {
            throw new TRPCError({
              code: 'UNAUTHORIZED',
              message: 'Invalid Credentials',
            });
          }

          return {
            id: user.id,
            nim: user.nim,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          } else {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              cause: error,
            });
          }
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

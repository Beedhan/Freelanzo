/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api } from "./../utils/api";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import logger from "logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      accessToken: string;
      workSpaceId: string;
      isWorkspaceOwner: boolean;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    session: ({ session, token }) => {
      console.log("callbackcalled");
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          accessToken: token.accessToken,
          workSpaceId: token.workspaceId,
          isWorkspaceOwner: token.isWorkspaceOwner,
        },
      };
    },
    async jwt({ token, user, isNewUser, trigger, account, session }) {
      console.log("callback called");

      let workspaceId;
      let ownerId;
      if (isNewUser) {
        const workspace = await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            workspace: {
              create: {},
            },
          },
          include: {
            workspace: true,
          },
        });
        workspaceId = workspace.workspace[0]?.id;
      } else if (user) {
        const workspace = await prisma.workspace.findFirst({
          where: {
            ownerId: user?.id,
          },
        });
        if (workspace) {
          workspaceId = workspace.id;
        }
      }
      if (account) {
        token.accessToken = account?.access_token;
        token.id = user.id;
        token.workspaceId = workspaceId;
        token.isWorkspaceOwner = true;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (trigger === "update" && session !== undefined) {
        logger.info(
          JSON.stringify(session),
          JSON.stringify(token),
          "workspace switch"
        );
        if (session?.isWorkspaceOwner && token.id) {
          const workspace = await prisma.workspace.findFirst({
            where: {
              ownerId: token?.id,
            },
          });
          if (workspace) {
            token.workspaceId = workspace.id;
            token.isWorkspaceOwner = true;
          }
        } else {
          token.isWorkspaceOwner = session?.isWorkspaceOwner;
          token.workspaceId = session?.workspaceId;
        }
      }
      logger.info(JSON.stringify(token), "jwt");
      return token;
    },
    redirect({ baseUrl, url }) {
      if (url.includes("invitation")) {
        return url;
      }
      return baseUrl + "/inbox";
    },
    signIn({ user, account, profile, email, credentials }) {
      return true;
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        console.log(credentials, "credentials");
        const user = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
          },
        });
        if (credentials?.password && user?.password) {
          const result = await bcrypt.compare(
            credentials?.password,
            user?.password
          );
          if (result) {
            return user;
          }
        }
        return null;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

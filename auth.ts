import NextAuth, { type NextAuthOptions, getServerSession } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"
import GoogleProvider from "next-auth/providers/google"

import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role as UserRole
      }

      return session
    },
    async jwt({ token, user }) {
      const prismaUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!prismaUser) {
        token.id = user?.id
        token.role = user?.role

        return token
      }

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        picture: prismaUser.image,
        role: prismaUser.role,
      }
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
}

export default NextAuth(authOptions)

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { LoginSchema } from '@/lib/zod/login-schema'
import bcrypt from 'bcryptjs'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    GitHub({
      profile(profile) {
        return {
          id: profile.id.toString(),
          username: profile.name || profile.login,
          email: profile.email?.toLowerCase(),
          role: 'user',
        }
      },
    }),
    Google({
      profile(profile) {
        return {
          id: profile.id.toString(),
          username: profile.name || profile.login,
          email: profile.email.toLowerCase(),
          role: 'user',
        }
      },
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedData = LoginSchema.safeParse(credentials)

        if (!validatedData.success) return null

        const { email: rawEmail, password } = validatedData.data
        const email = rawEmail.toLowerCase()

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (passwordMatch) {
          if (!user.emailVerified) {
            throw new Error('email_not_verified')
          }

          return user
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT
      user?: User
      trigger?: string
      session?: Session
    }) {
      if (user) {
        token.id = user.id ?? ''
        token.name = user.username || user.name
        token.email = user.email
        token.role = user.role ?? 'user'
        token.passwordChangedAt = user.passwordChangedAt
        token.tokenVersion = user.tokenVersion
      }

      if (trigger === 'update' && session?.passwordChangedAt) {
        token.passwordChangedAt = session.passwordChangedAt
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: token.id },
        select: { passwordChangedAt: true, tokenVersion: true },
      })

      if (dbUser?.passwordChangedAt && token.iat) {
        const dbChangeTimestamp = Math.floor(
          dbUser.passwordChangedAt.getTime() / 1000,
        )

        if (token.iat < dbChangeTimestamp) {
          return null
        }
      }

      if (dbUser?.tokenVersion && dbUser.tokenVersion !== token.tokenVersion) {
        return null
      }

      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        session.user.id = token.id
        session.user.username = token.name
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
  },
})

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
import { UAParser } from 'ua-parser-js'

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

        const connectionId = crypto.randomUUID()
        token.connectionId = connectionId

        const { headers: getHeaders } = await import('next/headers')
        const headerList = await getHeaders()

        const userAgent = headerList.get('user-agent') || ''
        const ip =
          headerList.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'

        const parser = new UAParser(userAgent)
        const { name: browserName, major: browserVer } = parser.getBrowser()
        const { name: osName, version: osVer } = parser.getOS()

        let city = headerList.get('x-vercel-ip-city')
        let country = headerList.get('x-vercel-ip-country')

        if (!city && process.env.NODE_ENV === 'development') {
          try {
            const testIp = '89.64.0.0'
            const res = await fetch(
              `http://ip-api.com/json/${testIp}?fields=status,country,city`,
            )
            const data = await res.json()

            if (data.status === 'success') {
              city = data.city
              country = data.country
            }
          } catch (error) {
            city = 'Dev-City'
            country = 'Dev-Country'
          }
        }

        city = city || 'Unknown'
        country = country || 'Unknown'

        try {
          await prisma.activeConnection.create({
            data: {
              userId: user.id!,
              sessionToken: connectionId,
              ipAddress: ip,
              browser: browserName,
              browserVersion: browserVer,
              os: osName,
              osVersion: osVer,
              city,
              country,
            },
          })
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[ DATABASE_ERROR ]: Failed to log connection', error)
          }
        }
      }

      if (trigger === 'update' && session?.passwordChangedAt) {
        token.passwordChangedAt = session.passwordChangedAt
      }

      if (trigger === 'update' && session?.user) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { username: true },
        })

        if (freshUser) {
          token.name = freshUser.username
        }
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

      const activeConn = await prisma.activeConnection.findUnique({
        where: { sessionToken: token.connectionId as string },
      })

      if (!activeConn) {
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
        session.user.connectionId = token.connectionId
      }
      return session
    },
  },

  events: {
    async signOut(message) {
      if ('token' in message && message.token?.connectionId) {
        try {
          await prisma.activeConnection.delete({
            where: { sessionToken: message.token.connectionId as string },
          })
        } catch (error) {
          console.error(
            '[ LOGOUT_ERROR ]: Failed to remove database log',
            error,
          )
        }
      }
    },
  },
})

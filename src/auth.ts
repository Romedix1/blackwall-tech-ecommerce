import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { LoginSchema } from '@/lib/zod/login-schema'
import bcrypt from 'bcryptjs'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    GitHub,
    Google,
    Credentials({
      authorize: async (credentials) => {
        const validatedData = LoginSchema.safeParse(credentials)

        if (!validatedData.success) return null

        const { email, password } = validatedData.data
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
})

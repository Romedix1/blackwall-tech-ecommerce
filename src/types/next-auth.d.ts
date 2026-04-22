import { DefaultSession, DefaultUser } from 'next-auth'
import { Role } from '../../generated/prisma'

declare module 'next-auth' {
  interface Session {
    passwordChangedAt?: Date | null
    user: {
      id: string
      username?: string | null
      role: Role
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    username?: string | null
    role?: Role
    passwordChangedAt?: Date | null
    tokenVersion?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username?: string | null
    role: Role
    passwordChangedAt?: Date | null
    iat?: number
    tokenVersion?: number
  }
}

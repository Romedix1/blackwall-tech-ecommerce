import { DefaultSession, DefaultUser } from 'next-auth'
import { Role } from '../../generated/prisma'

declare module 'next-auth' {
  interface Session {
    passwordChangedAt?: Date | null
    connectionId?: string
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
    connectionId?: string
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
    connectionId?: string
  }
}

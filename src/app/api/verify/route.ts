import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    redirect('/login?error=missing_token')
  }

  let redirectTo = ''

  try {
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!existingToken) {
      redirectTo = '/login?error=invalid_token'
    } else if (new Date(existingToken.expires) < new Date()) {
      redirectTo = '/login?error=token_expired'
    } else {
      const user = await prisma.user.findUnique({
        where: { email: existingToken.identifier },
      })

      if (!user) {
        redirectTo = '/login?error=user_not_found'
      } else {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
          }),
          prisma.verificationToken.delete({
            where: { id: existingToken.id },
          }),
        ])

        redirectTo = '/'
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ VERIFY_CRITICAL_ERROR ]:', error)
    }
    redirectTo = '/login?error=protocol_failure'
  }

  redirect(redirectTo)
}

// TODO: ADD ALL ERRORS IN LOGIN PAGE
// TODO: ADD EXPIRED TOKEN PAGE AND EMAIL RESEND

import { prisma } from '@/lib/prisma/prisma'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    redirect('/login?error=missing_token')
  }

  let success = false

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    })

    if (!user) {
      redirect('/login?error=invalid_token')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    })

    success = true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ VERIFY_CRITICAL_ERROR ]:', error)
    }
    redirect('/login?error=protocol_failure')
  }

  if (success) {
    redirect('/login')
  } else {
    redirect('/login?error=invalid_token')
  }
}

// TODO: ADD ALL ERRORS IN LOGIN PAGE

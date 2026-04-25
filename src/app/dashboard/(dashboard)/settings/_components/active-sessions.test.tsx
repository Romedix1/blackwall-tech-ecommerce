/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { ActiveSessions } from './active-sessions'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { vi, describe, it, expect } from 'vitest'
import { Session } from 'next-auth'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    activeConnection: {
      findMany: vi.fn(() => Promise.resolve([])),
    },
  },
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('./other-session-block', () => ({
  OtherSessionBlock: ({ session }: any) => (
    <div data-testid="other-session">{session.browser}</div>
  ),
}))

describe('Active sessions', () => {
  const mockUserId = 'user-123'
  const mockConnectionId = 'token-1'

  const mockSessions = [
    {
      ipAddress: '192.168.1.1',
      browser: 'Chrome',
      browserVersion: '120',
      os: 'Windows',
      osVersion: '11',
      country: 'Poland',
      city: 'Warsaw',
      sessionToken: 'token-1',
    },
    {
      ipAddress: '10.0.0.1',
      browser: 'Firefox',
      browserVersion: '115',
      os: 'Linux',
      osVersion: 'Ubuntu',
      country: 'Germany',
      city: 'Berlin',
      sessionToken: 'token-2',
    },
  ]

  const mockedAuth = vi.mocked(auth as unknown as () => Promise<Session | null>)

  it('Should redirect to home if no session exists', async () => {
    mockedAuth.mockResolvedValue(null)

    const result = await ActiveSessions()
    render(result)

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('Should render current session details correctly', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: mockUserId, connectionId: mockConnectionId },
    } as any)

    vi.mocked(prisma.activeConnection.findMany).mockResolvedValue(
      mockSessions as any,
    )

    const result = await ActiveSessions()
    render(result)

    expect(screen.getByText(/Current_session/i)).toBeInTheDocument()
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
    expect(screen.getByText(/Chrome V120/i)).toBeInTheDocument()
    expect(screen.getByText(/Windows 11/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Uplink_Location: Poland, Warsaw/i),
    ).toBeInTheDocument()
  })

  it('Should list other sessions and show appropriate header', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: mockUserId, connectionId: mockConnectionId },
    } as any)

    vi.mocked(prisma.activeConnection.findMany).mockResolvedValue(
      mockSessions as any,
    )

    const result = await ActiveSessions()
    render(result)

    expect(screen.getByText(/Other_sessions/i)).toBeInTheDocument()

    const otherSessions = screen.getAllByTestId('other-session')
    expect(otherSessions).toHaveLength(1)
    expect(otherSessions[0]).toHaveTextContent('Firefox')
  })

  it('Should not show Other_sessions header if only current session exists', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: mockUserId, connectionId: mockConnectionId },
    } as any)

    vi.mocked(prisma.activeConnection.findMany).mockResolvedValue([
      mockSessions[0],
    ] as any)

    const result = await ActiveSessions()
    render(result)

    expect(screen.queryByText(/Other_sessions/i)).not.toBeInTheDocument()
    expect(screen.queryByTestId('other-session')).not.toBeInTheDocument()
  })
})

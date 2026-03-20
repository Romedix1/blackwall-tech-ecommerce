import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

vi.mock('@/auth', () => ({
  auth: vi.fn(() => null),
  handlers: {},
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('next/server', () => ({
  NextRequest: vi.fn(),
  NextResponse: vi.fn(),
}))

vi.mock('@/lib/actions', () => ({
  fetchCartFromDb: vi.fn().mockResolvedValue([]),
  saveCartInDb: vi.fn().mockResolvedValue({ success: true }),

  SearchInDb: vi.fn().mockResolvedValue({ products: [], categories: [] }),

  LoginUser: vi.fn().mockResolvedValue({ success: true }),
  RegisterUser: vi.fn().mockResolvedValue({ success: true }),
}))

afterEach(() => {
  cleanup()
})

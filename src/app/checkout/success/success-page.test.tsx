import { render, screen } from '@testing-library/react'
import CheckoutSuccessPage from '@/app/checkout/success/page'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { vi, expect, it, describe } from 'vitest'

vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        retrieve: vi.fn(),
      },
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findFirst: vi.fn(),
    },
  },
}))

vi.mock('./_components/cart-cleaner', () => ({
  CartCleaner: () => <div data-testid="cart-cleaner-mock" />,
}))

describe('Success page', () => {
  it('Should render CartCleaner if order is paid', async () => {
    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      payment_status: 'paid',
      payment_intent: { status: 'succeeded' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    vi.mocked(prisma.order.findFirst).mockResolvedValue({
      id: 'order_123',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const searchParams = Promise.resolve({ session_id: 'test_session' })

    const PageResult = await CheckoutSuccessPage({ searchParams })

    render(PageResult)

    expect(screen.getByTestId('cart-cleaner-mock')).toBeInTheDocument()
    expect(screen.getByText(/TRANSACTION_AUTHORIZED/i)).toBeInTheDocument()
  })

  it('Should not render CartCleaner if order is unpaid', async () => {
    vi.mocked(stripe.checkout.sessions.retrieve).mockResolvedValue({
      payment_status: 'unpaid',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const searchParams = Promise.resolve({ session_id: 'test_session' })

    const PageResult = await CheckoutSuccessPage({ searchParams })
    render(PageResult)

    expect(screen.queryByTestId('cart-cleaner-mock')).not.toBeInTheDocument()
  })
})

import { CartOverlay } from '@/components/layout/cart-overlay'
import { useCart } from '@/hooks/use-cart'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import type { Mock } from 'vitest'

vi.mock('@/hooks/use-cart', () => ({
  useCart: vi.fn(),
}))

describe('Cart overlay component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render empty state where there are no items', () => {
    const mockState = {
      isOpen: true,
      toggle: vi.fn(),
      items: [],
    }

    ;(useCart as unknown as Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockState)
      }
      return mockState
    })

    render(<CartOverlay />)

    expect(screen.getByText(/Inventory is empty/i)).toBeInTheDocument()
  })

  it('should render items and calculate subtotal correctly', () => {
    const mockState = {
      isOpen: true,
      toggle: vi.fn(),
      items: [
        {
          slug: 'rtx-5090-ti',
          name: 'RTX 5090 TI',
          price: 1999.0,
          quantity: 2,
          imgSrc: '/test.png',
        },
      ],
    }

    ;(useCart as unknown as Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockState)
      }
      return mockState
    })

    render(<CartOverlay />)

    expect(screen.getByText(/RTX 5090 TI/i)).toBeInTheDocument()
    expect(screen.getByText(/3998\.00/)).toBeInTheDocument()
  })
})

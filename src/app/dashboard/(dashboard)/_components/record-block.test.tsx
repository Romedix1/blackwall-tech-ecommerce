/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecordBlock } from '@/app/dashboard/(dashboard)/_components/record-block'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}))

describe('Record block', () => {
  const mockOrder = {
    id: 'order_123',
    status: 'complete',
    createdAt: new Date(),
  }

  const mockBuild = {
    id: 'build_123',
    status: 'warning',
    name: 'Netrunner setup',
    public: false,
    createdAt: new Date(),
  }

  describe('Order Type', () => {
    it('Should render order details correctly', () => {
      render(<RecordBlock record={mockOrder as any} type="order" />)

      expect(screen.getByText(/order #order_123/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Status: OPERATION_SUCCESSFUL/i),
      ).toBeInTheDocument()
    })

    it('Should have correct navigation link for order', () => {
      render(<RecordBlock record={mockOrder as any} type="order" />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/dashboard/order/order_123')
    })

    it('Should display "Delivered" when ETA is in the past', () => {
      const currentDate = new Date()
      const pastDate = currentDate.setDate(currentDate.getDate() - 10)

      render(
        <RecordBlock
          record={{ ...mockOrder, createdAt: pastDate } as any}
          type="order"
        />,
      )
      expect(screen.getAllByText(/Delivered/i)).toHaveLength(2)
    })
  })

  describe('Build Type', () => {
    it('Should render build details and configuration name', () => {
      render(<RecordBlock record={mockBuild as any} type="build" />)

      expect(
        screen.getByText(/configuration Netrunner setup/i),
      ).toBeInTheDocument()
      expect(screen.getByText(/Status: warning/i)).toBeInTheDocument()
    })

    it('Should have correct navigation link for build', () => {
      render(<RecordBlock record={mockBuild as any} type="build" />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/pc-builder/cpu/build_123')
    })

    it('Should show ShareModal when Broadcast button is clicked', async () => {
      const user = userEvent.setup()
      render(<RecordBlock record={mockBuild as any} type="build" />)

      const broadcastBtn = screen.getByRole('button', { name: /share build/i })
      await user.click(broadcastBtn)

      expect(
        screen.getByText(
          /Establishing a public uplink allows other operators/i,
        ),
      ).toBeInTheDocument()
    })

    it('should show DeleteModal when Wipe button is clicked', async () => {
      const user = userEvent.setup()
      render(<RecordBlock record={mockBuild as any} type="build" />)

      const wipeBtn = screen.getByRole('button', { name: /delete build/i })
      await user.click(wipeBtn)

      expect(
        screen.getByText(
          /You are about to permanently deconstruct the following configuration/i,
        ),
      ).toBeInTheDocument()
    })
  })

  describe('Logic: getETA', () => {
    it('should show correct days remaining', () => {
      const futureDate = new Date()

      render(
        <RecordBlock
          record={{ ...mockOrder, createdAt: futureDate } as any}
          type="order"
        />,
      )

      expect(screen.getByText(/3 days/i)).toBeInTheDocument()
    })
  })
})

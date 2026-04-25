import { RenderRecords } from '@/app/dashboard/(dashboard)/_components/render-records'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('Render records', () => {
  describe('Render order records', () => {
    it('Should render "no orders" text if there are 0 orders', () => {
      render(<RenderRecords records={[]} type="order" />)

      expect(
        screen.getByText(/No orders found in history/i),
      ).toBeInTheDocument()
    })

    it('Should render a list of orders when records are provided', () => {
      const mockRecords = [
        { id: '1', status: 'pending', createdAt: new Date() },
        { id: '2', status: 'delivered', createdAt: new Date() },
      ]

      render(<RenderRecords records={mockRecords} type="order" />)

      const orderElements = screen.getAllByText(/order/i)
      expect(orderElements).toHaveLength(2)
    })
  })

  describe('Render build records', () => {
    it('Should render "no builds" text if there are 0 builds', () => {
      render(<RenderRecords records={[]} type="build" />)

      expect(
        screen.getByText(/No builds found in history/i),
      ).toBeInTheDocument()
    })

    it('Should render a list of builds when records are provided', () => {
      const mockRecords = [
        {
          id: '1',
          status: 'warning',
          createdAt: new Date(),
          public: true,
          name: 'build1',
        },
        {
          id: '2',
          status: 'idle',
          createdAt: new Date(),
          public: true,
          name: 'build2',
        },
      ]

      render(<RenderRecords records={mockRecords} type="build" />)

      const buildElements = screen.getAllByText(/configuration/i)
      expect(buildElements).toHaveLength(2)
    })
  })
})

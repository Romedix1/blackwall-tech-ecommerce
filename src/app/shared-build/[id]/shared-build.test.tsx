import SharedBuildPage from '@/app/shared-build/[id]/page'
import { prisma } from '@/lib/prisma'
import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react'
import { redirect } from 'next/navigation'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    build: {
      findFirst: vi.fn(),
    },
  },
}))

describe('Shared build page', () => {
  it("Should redirect if build doesn't exist", async () => {
    const buildId = 'test-123'

    vi.mocked(prisma.build.findFirst).mockResolvedValue(null)

    const params = Promise.resolve({ id: buildId })

    await SharedBuildPage({ params })

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('Should render not public view', async () => {
    const buildId = 'test-123'

    vi.mocked(prisma.build.findFirst).mockResolvedValue({
      id: buildId,
      userId: 'user-123',
      name: 'Test Build',
      public: false,
      status: 'failed',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const params = Promise.resolve({ id: buildId })

    const pageJSX = await SharedBuildPage({ params })
    render(pageJSX)

    const accessDeniedMessage = screen.getByText(/access denied/i)

    expect(accessDeniedMessage).toBeInTheDocument()
  })

  it('Should display user build items', async () => {
    const mockItems = [
      {
        quantity: 1,
        productSlug: 'intel-core-i9-14900k',
        product: {
          name: 'Intel Core i9-14900K',
          price: 589.0,
          category: {
            slug: 'cpu',
          },
        },
      },
      {
        quantity: 1,
        productSlug: 'nvidia-rtx-4090-fe',
        product: {
          name: 'NVIDIA GeForce RTX 4090 Founders Edition',
          price: 1599.99,
          category: {
            slug: 'gpu',
          },
        },
      },
      {
        quantity: 2,
        productSlug: 'corsair-vengeance-32gb-ddr5',
        product: {
          name: 'Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz',
          price: 125.5,
          category: {
            slug: 'ram',
          },
        },
      },
    ]

    const buildId = 'test-123'

    const date = new Date()

    vi.mocked(prisma.build.findFirst).mockResolvedValue({
      id: buildId,
      name: 'Cyberpunk_build',
      public: true,
      userId: 'user-123',
      createdAt: date,
      updatedAt: date,
      createdBy: { username: 'NightCity_Legend' },
      items: mockItems,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const params = Promise.resolve({ id: buildId })

    const pageJSX = await SharedBuildPage({ params })
    render(pageJSX)

    expect(screen.getByText(`${date.toLocaleDateString()}`)).toBeInTheDocument()

    expect(screen.getByText(/NightCity_Legend/i)).toBeInTheDocument()

    expect(screen.getByText(/Intel Core i9-14900K/i)).toBeInTheDocument()
    expect(screen.getByText(/Corsair Vengeance/i)).toBeInTheDocument()

    expect(screen.getByText(/Quantity: 2/i)).toBeInTheDocument()

    const expectedTotal = '$2439.99'
    expect(screen.getByText(expectedTotal)).toBeInTheDocument()
  })
})

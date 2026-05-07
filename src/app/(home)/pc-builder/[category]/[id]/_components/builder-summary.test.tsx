import { BuilderSummary } from '@/app/(home)/pc-builder/[category]/[id]/_components/builder-summary'
import { useCart } from '@/hooks'
import { useBuilder } from '@/hooks/use-builder'
import { updateBuildName } from '@/lib/actions'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { vi } from 'vitest'

vi.mock('@/hooks', () => ({
  useCart: vi.fn(),
  useDebounce: vi.fn((value) => value),
}))

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
}))

vi.mock('@/lib/actions', () => ({
  updateBuildName: vi.fn(),
}))

vi.mock('@/hooks/use-builder', () => ({
  useBuilder: vi.fn(),
}))

const validationCases = [
  {
    name: 'Excessive CPU count',
    items: [{ category: 'cpu', quantity: 2, price: 500 }],
    expectedStatus: 'failed',
    expectedMessage: /excessive_cpu_count/i,
    expectedPrice: '1000.00',
  },
  {
    name: 'Multiple motherboards detected',
    items: [{ category: 'motherboards', quantity: 2, price: 200 }],
    expectedStatus: 'failed',
    expectedMessage: /multiple_motherboards_detected/i,
    expectedPrice: '400.00',
  },
  {
    name: 'Too many power supplies',
    items: [{ category: 'psu', quantity: 2, price: 100 }],
    expectedStatus: 'failed',
    expectedMessage: /too_many_power_supplies/i,
    expectedPrice: '200.00',
  },
  {
    name: 'Socket mismatch between CPU and MOBO',
    items: [
      {
        category: 'cpu',
        quantity: 1,
        price: 300,
        technical: { socket: 'LGA1700' },
      },
      {
        category: 'motherboards',
        quantity: 1,
        price: 150,
        technical: { socket: 'AM5' },
      },
    ],
    expectedStatus: 'failed',
    expectedMessage: /socket_mismatch/i,
    expectedPrice: '450.00',
  },
  {
    name: 'Incompatible RAM generation',
    items: [
      {
        category: 'motherboards',
        quantity: 1,
        price: 200,
        technical: { ramGen: 'DDR5' },
      },
      {
        category: 'memory',
        quantity: 1,
        price: 80,
        technical: { ramGen: 'DDR4' },
      },
    ],
    expectedStatus: 'failed',
    expectedMessage: /ram_type_incompatible/i,
    expectedPrice: '280.00',
  },
  {
    name: 'Exceeding RAM slots',
    items: [
      {
        category: 'motherboards',
        quantity: 1,
        price: 100,
        technical: { ramSlots: 2 },
      },
      { category: 'memory', quantity: 3, price: 40 },
    ],
    expectedStatus: 'failed',
    expectedMessage: /too_many_ram_sticks_Max:_2/i,
    expectedPrice: '220.00',
  },
  {
    name: 'Exceeding max RAM capacity',
    items: [
      {
        category: 'motherboards',
        quantity: 1,
        price: 200,
        technical: { maxRamCapacity: 32 },
      },
      {
        category: 'memory',
        quantity: 2,
        price: 100,
        technical: { capacity: 32 },
      },
    ],
    expectedStatus: 'failed',
    expectedMessage: /EXCEEDS_MAX_RAM_CAPACITY_\(32GB\)/i,
    expectedPrice: '400.00',
  },
  {
    name: 'Exceeding M.2 storage slots',
    items: [
      {
        category: 'motherboards',
        quantity: 1,
        price: 150,
        technical: { m2Slots: 1 },
      },
      { category: 'storage', quantity: 2, price: 60 },
    ],
    expectedStatus: 'failed',
    expectedMessage: /exceeds_storage_slots_Limit:_1/i,
    expectedPrice: '270.00',
  },
  {
    name: 'PSU underwattage (Base TDP)',
    items: [
      { category: 'cpu', quantity: 1, price: 400, technical: { tdp: 500 } },
      { category: 'psu', quantity: 1, price: 100, technical: { wattage: 450 } },
    ],
    expectedStatus: 'failed',
    expectedMessage: /psu_underwattage/i,
    expectedPrice: '500.00',
  },
  {
    name: 'Max power exceeded (Peak TDP)',
    items: [
      {
        category: 'cpu',
        quantity: 1,
        price: 400,
        technical: { tdp: 300, maxTdp: 800 },
      },
      { category: 'psu', quantity: 1, price: 100, technical: { wattage: 700 } },
    ],
    expectedStatus: 'failed',
    expectedMessage: /max_power_exceeded/i,
    expectedPrice: '500.00',
  },
  {
    name: 'Missing critical components',
    items: [
      { category: 'cpu', quantity: 1, price: 300 },
      { category: 'motherboards', quantity: 1, price: 200 },
    ],
    expectedStatus: 'warning',
    expectedMessage: /awaiting_critical_components/i,
    expectedPrice: '500.00',
  },
  {
    name: 'System stable build',
    items: [
      {
        category: 'cpu',
        quantity: 1,
        price: 300,
        technical: { socket: 'AM5', tdp: 65 },
      },
      {
        category: 'motherboards',
        quantity: 1,
        price: 200,
        technical: { socket: 'AM5', ramSlots: 4 },
      },
      {
        category: 'memory',
        quantity: 2,
        price: 100,
        technical: { ramGen: 'DDR5' },
      },
      {
        category: 'psu',
        quantity: 1,
        price: 150,
        technical: { wattage: 1000 },
      },
    ],
    expectedStatus: 'success',
    expectedMessage: /system_stable/i,
    expectedPrice: '850.00',
  },
]

describe('Builder summary', () => {
  const mockSetCart = vi.fn()
  const mockToggle = vi.fn()
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useCart).mockReturnValue({
      items: [],
      setCart: mockSetCart,
      toggle: mockToggle,
    })

    vi.mocked(useParams).mockReturnValue({ id: 'test-build-id' })

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    })
  })

  test.each(validationCases)(
    'Should verify status and price for: $name',
    ({ items, expectedStatus, expectedMessage, expectedPrice }) => {
      vi.mocked(useBuilder).mockReturnValue({ items, buildId: 'test-build-id' })

      render(<BuilderSummary buildName="punk build" isPublic={false} />)

      const textElement = screen.getByText(expectedMessage)
      const statusContainer = textElement.closest('p')

      expect(textElement).toBeInTheDocument()

      const classMap = {
        failed: 'text-error-text',
        warning: 'text-warning',
        success: 'text-accent',
      }

      expect(statusContainer).toHaveClass(
        classMap[expectedStatus as keyof typeof classMap],
      )

      expect(
        screen.getByText(new RegExp(`Total: \\$ ${expectedPrice}`, 'i')),
      ).toBeInTheDocument()
    },
  )

  it('Should open critical error modal when build has failed status', async () => {
    const items = [{ category: 'cpu', quantity: 2, price: 500 }]
    vi.mocked(useBuilder).mockReturnValue({ items, buildId: 'test-build-id' })
    const user = userEvent.setup()

    render(<BuilderSummary buildName="Failed" isPublic={false} />)
    await user.click(
      screen.getByRole('button', { name: /add product to cart/i }),
    )

    expect(screen.getByText(/critical_build_error/i)).toBeInTheDocument()
  })

  it('Should open warning modal when build is incomplete', async () => {
    const items = [{ category: 'cpu', quantity: 1, price: 300 }]
    vi.mocked(useBuilder).mockReturnValue({ items, buildId: 'test-build-id' })
    const user = userEvent.setup()

    render(<BuilderSummary buildName="test-build" isPublic={false} />)
    await user.click(
      screen.getByRole('button', { name: /add product to cart/i }),
    )

    expect(screen.getByText(/incomplete_configuration/i)).toBeInTheDocument()
  })

  it('Should redirect to home if buildId is missing from URL', () => {
    vi.mocked(useParams).mockReturnValue({})
    render(<BuilderSummary buildName="Test" isPublic={false} />)
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('Should hide terminal input and broadcast button for guests', () => {
    render(<BuilderSummary buildName="corp build" isPublic={false} />)
    expect(screen.queryByLabelText(/build name/i)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /broadcast/i }),
    ).not.toBeInTheDocument()
  })

  it('Should trigger database sync when build name is changed', async () => {
    const user = userEvent.setup()
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: 'user-123',
          role: 'user',
          username: 'Johnny',
          email: 'ghost@blackwall.tech',
        },
        expires: '9999-12-31',
      },
      status: 'authenticated',
      update: vi.fn(),
    })
    render(<BuilderSummary buildName="Old Name" isPublic={false} />)

    const input = screen.getByLabelText(/build name/i)
    await user.type(input, 'New Genesis')

    await waitFor(() => {
      expect(updateBuildName).toHaveBeenCalledWith(
        'test-build-id',
        'user-123',
        'New Genesis',
      )
    })
  })

  it('Should bypass modals and add directly to cart if system is stable', async () => {
    const user = userEvent.setup()

    const stableItems = [
      {
        category: 'cpu',
        quantity: 1,
        price: 500,
        slug: 'i9',
        name: 'i9',
        technical: { socket: 'LGA1700' },
      },
      {
        category: 'motherboards',
        quantity: 1,
        price: 300,
        slug: 'z790',
        name: 'z790',
        technical: { socket: 'LGA1700', ramSlots: 4 },
      },
      {
        category: 'memory',
        quantity: 2,
        price: 100,
        slug: 'ram',
        name: 'ram',
        technical: { ramGen: 'DDR5' },
      },
      {
        category: 'psu',
        quantity: 1,
        price: 150,
        slug: 'psu',
        name: 'psu',
        technical: { wattage: 1000 },
      },
    ]

    vi.mocked(useBuilder).mockReturnValue({
      items: stableItems,
      buildId: 'test-build-id',
    })

    render(<BuilderSummary buildName="Stable build" isPublic={false} />)

    const addButton = screen.getByRole('button', {
      name: /add product to cart/i,
    })
    await user.click(addButton)

    expect(screen.queryByText(/critical_build_error/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/incomplete_configuration/i),
    ).not.toBeInTheDocument()
    expect(mockSetCart).toHaveBeenCalled()
    expect(mockToggle).toHaveBeenCalled()
  })
})

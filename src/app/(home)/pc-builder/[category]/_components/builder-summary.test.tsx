import { BuilderSummary } from '@/app/(home)/pc-builder/[category]/_components/builder-summary'
import { useCart } from '@/hooks'
import { useBuilder } from '@/hooks/use-builder'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mock } from 'vitest'

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

vi.mock('@/hooks', () => ({
  useCart: vi.fn(),
}))

vi.mock('@/hooks/use-builder', () => ({
  useBuilder: vi.fn(),
}))

describe('Builder summary', () => {
  beforeEach(() => {
    ;(useCart as unknown as Mock).mockReturnValue({
      items: [],
      setCart: vi.fn(),
      toggle: vi.fn(),
    })
  })

  test.each(validationCases)(
    'Should verify status and price for: $name',
    ({ items, expectedStatus, expectedMessage, expectedPrice }) => {
      ;(useBuilder as unknown as Mock).mockReturnValue({ items })

      render(<BuilderSummary />)

      const textElement = screen.getByText(expectedMessage)

      const statusContainer = textElement.closest('p')

      expect(textElement).toBeInTheDocument()

      if (expectedStatus === 'failed') {
        expect(statusContainer).toHaveClass('text-error-text')
      }

      if (expectedStatus === 'warning') {
        expect(statusContainer).toHaveClass('text-warning')
      }

      if (expectedStatus === 'success') {
        expect(statusContainer).toHaveClass('text-accent')
      }

      const priceElement = screen.getByText(
        new RegExp(`Total: \\$ ${expectedPrice}`, 'i'),
      )
      expect(priceElement).toBeInTheDocument()
    },
  )

  it('Should open critical error modal when build has failed status', async () => {
    const items = [{ category: 'cpu', quantity: 2, price: 500 }]
    ;(useBuilder as unknown as Mock).mockReturnValue({ items })

    const user = userEvent.setup()

    render(<BuilderSummary />)

    const addButton = screen.getByRole('button', {
      name: /add product to cart/i,
    })
    await user.click(addButton)

    expect(screen.getByText(/critical_build_error/i)).toBeInTheDocument()
    expect(
      screen.getByText(/alert: adding_incompatible_hardware/i),
    ).toBeInTheDocument()
  })

  it('Should open warning modal when build is incomplete', async () => {
    const items = [{ category: 'cpu', quantity: 1, price: 300 }]
    ;(useBuilder as unknown as Mock).mockReturnValue({ items })

    const user = userEvent.setup()

    render(<BuilderSummary />)

    const addButton = screen.getByRole('button', {
      name: /add product to cart/i,
    })
    await user.click(addButton)

    expect(screen.getByText(/incomplete_configuration/i)).toBeInTheDocument()
    expect(
      screen.getByText(/notice: proceeding_with_incomplete_system/i),
    ).toBeInTheDocument()
  })
})

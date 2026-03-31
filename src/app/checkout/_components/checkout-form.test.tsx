import { CheckoutForm } from '@/app/checkout/_components/checkout-form'
import { useCart } from '@/hooks'
import { checkout } from '@/lib/actions'
import { MockState } from '@/types/cart-mock-item'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/lib/actions', () => ({
  checkout: vi.fn(),
}))

vi.mock('@/hooks', () => ({
  useCart: vi.fn((selector) => selector({ items: [] })),
}))

describe('Checkout form', () => {
  it('Should load user email', () => {
    render(
      <CheckoutForm
        userEmail={'test@example.com'}
        canceled={false}
        draftData={null}
      />,
    )

    const emailInput = screen.getByLabelText('Email')

    expect(emailInput).toHaveValue('test@example.com')
  })

  it('Should show all errors', async () => {
    const expectedErrors = [
      'Name too short',
      'Address too short',
      'Invalid email address',
      'Empty email address',
      'City required',
      'Zip code required',
      'Phone number too short',
    ]

    vi.mocked(checkout).mockResolvedValueOnce({
      error: expectedErrors,
      fields: {},
    })

    render(<CheckoutForm userEmail={null} canceled={false} draftData={null} />)

    const user = userEvent.setup()

    const submitButton = screen.getByRole('button', { name: 'Confirm order' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('[ ! ] Uplink_rejected: Data_corrupted'),
      ).toBeInTheDocument()

      expectedErrors.forEach((errorMessage) => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })
  })

  it('Should show cancel error when order is canceled', () => {
    render(<CheckoutForm userEmail={null} canceled={true} draftData={null} />)

    const cancelError = screen.getByText(/Payment cancelled/)
    expect(cancelError).toBeInTheDocument()
  })

  it('Should load draftData after failure', () => {
    const mockData = {
      fullName: 'David Martinez',
      shippingAddress: 'Apt 404 H10',
      email: 'netrunner@cyber.net',
      city: 'Night City',
      zipCode: 'NC-2077',
      phone: '000-0000-000',
    }

    render(
      <CheckoutForm userEmail={null} canceled={true} draftData={mockData} />,
    )

    expect(screen.getByLabelText('Full name')).toHaveValue('David Martinez')
    expect(screen.getByLabelText('Shipping address')).toHaveValue('Apt 404 H10')
    expect(screen.getByLabelText('Email')).toHaveValue('netrunner@cyber.net')
    expect(screen.getByLabelText('City')).toHaveValue('Night City')
    expect(screen.getByLabelText('Zip code')).toHaveValue('NC-2077')
    expect(screen.getByLabelText('Phone number')).toHaveValue('000-0000-000')
  })

  it('Should calculate cart (subtotal, tax, total) correctly', () => {
    vi.mocked(useCart).mockImplementationOnce((selector) =>
      selector({
        isOpen: false,
        toggle: vi.fn(),
        addItem: vi.fn(),
        updateQuantity: vi.fn(),
        removeItem: vi.fn(),
        setCart: vi.fn(),
        items: [
          {
            slug: 'neuro-processor',
            price: 100.5,
            quantity: 2,
            name: 'Neuro Processor',
            imgSrc: '/neuro.jpg',
          },
          {
            slug: 'optic-cable',
            price: 250,
            quantity: 1,
            name: 'Optic Cable',
            imgSrc: '/optic.jpg',
          },
        ] as MockState[],
      }),
    )

    render(<CheckoutForm userEmail={null} canceled={false} draftData={null} />)

    expect(screen.getByText('$ 451.00')).toBeInTheDocument()
    expect(screen.getByText('$ 103.73')).toBeInTheDocument()
    expect(screen.getByText('$ 554.73')).toBeInTheDocument()
  })

  it('Should set checkout button as disabled while pending', async () => {
    const mockData = {
      fullName: 'David Martinez',
      shippingAddress: 'Apt 404 H10',
      email: 'netrunner@cyber.net',
      city: 'Night City',
      zipCode: 'NC-2077',
      phone: '000-0000-000',
    }

    vi.mocked(checkout).mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { error: [], fields: {} }
    })

    vi.mocked(useCart).mockImplementationOnce((selector) =>
      selector({
        isOpen: false,
        toggle: vi.fn(),
        addItem: vi.fn(),
        updateQuantity: vi.fn(),
        removeItem: vi.fn(),
        setCart: vi.fn(),
        items: [
          {
            slug: 'neuro-processor',
            price: 100.5,
            quantity: 2,
            name: 'Neuro Processor',
            imgSrc: '/neuro.jpg',
          },
          {
            slug: 'optic-cable',
            price: 250,
            quantity: 1,
            name: 'Optic Cable',
            imgSrc: '/optic.jpg',
          },
        ] as MockState[],
      }),
    )

    render(
      <CheckoutForm userEmail={null} canceled={false} draftData={mockData} />,
    )

    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: /Confirm order/i })

    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveAttribute('aria-label', 'Confirming')
  })

  it('Should call checkout action with correct data', async () => {
    vi.mocked(useCart).mockImplementationOnce((selector) =>
      selector({
        isOpen: false,
        toggle: vi.fn(),
        addItem: vi.fn(),
        updateQuantity: vi.fn(),
        removeItem: vi.fn(),
        setCart: vi.fn(),
        items: [
          {
            slug: 'neuro-processor',
            price: 100.5,
            quantity: 2,
            name: 'Neuro Processor',
            imgSrc: '/neuro.jpg',
          },
          {
            slug: 'optic-cable',
            price: 250,
            quantity: 1,
            name: 'Optic Cable',
            imgSrc: '/optic.jpg',
          },
        ] as MockState[],
      }),
    )

    render(<CheckoutForm userEmail={null} canceled={false} draftData={null} />)

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Full name/i), 'Vincent')
    await user.type(screen.getByLabelText(/Email/i), 'v@nightcity.nc')
    await user.type(screen.getByLabelText(/Shipping address/i), 'H10')
    await user.type(screen.getByLabelText(/City/i), 'Night City')
    await user.type(screen.getByLabelText(/Zip code/i), '00-000')
    await user.type(screen.getByLabelText(/Phone number/i), '123456789')

    const submitButton = screen.getByRole('button', { name: /Confirm order/i })
    await user.click(submitButton)

    expect(checkout).toHaveBeenCalled()

    const calls = vi.mocked(checkout).mock.calls
    const formData = calls[calls.length - 1][2] as FormData

    expect(formData.get('fullName')).toBe('Vincent')
    expect(formData.get('city')).toBe('Night City')

    expect(calls[calls.length - 1][0]).toEqual([
      { productSlug: 'neuro-processor', quantity: 2 },
      { productSlug: 'optic-cable', quantity: 1 },
    ])
  })
})

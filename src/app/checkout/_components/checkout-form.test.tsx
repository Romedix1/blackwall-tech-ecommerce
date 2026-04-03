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
  useCart: vi.fn((selector) =>
    selector({
      isOpen: false,
      toggle: vi.fn(),
      addItem: vi.fn(),
      updateQuantity: vi.fn(),
      removeItem: vi.fn(),
      setCart: vi.fn(),
      items: mockCartItems,
    }),
  ),
}))

const mockCartItems: MockState[] = [
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
]

describe('Checkout form', () => {
  it('Should load user email', async () => {
    render(
      <CheckoutForm
        userEmail={'test@example.com'}
        canceled={false}
        draftData={null}
      />,
    )

    const emailInput = await screen.findByLabelText('Email')

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

    const submitButton = await screen.findByRole('button', {
      name: 'Confirm order',
    })
    await user.click(submitButton)

    expect(
      await screen.findByText('[ ! ] Uplink_rejected: Data_corrupted'),
    ).toBeInTheDocument()

    for (const errorMessage of expectedErrors) {
      expect(await screen.findByText(errorMessage)).toBeInTheDocument()
    }
  })

  it('Should show cancel error when order is canceled', async () => {
    render(<CheckoutForm userEmail={null} canceled={true} draftData={null} />)

    const cancelError = await screen.findByText(/Payment cancelled/)
    expect(cancelError).toBeInTheDocument()
  })

  it('Should load draftData after failure', async () => {
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

    expect(await screen.findByLabelText('Full name')).toHaveValue(
      'David Martinez',
    )
    expect(await screen.findByLabelText('Shipping address')).toHaveValue(
      'Apt 404 H10',
    )
    expect(await screen.findByLabelText('Email')).toHaveValue(
      'netrunner@cyber.net',
    )
    expect(await screen.findByLabelText('City')).toHaveValue('Night City')
    expect(await screen.findByLabelText('Zip code')).toHaveValue('NC-2077')
    expect(await screen.findByLabelText('Phone number')).toHaveValue(
      '000-0000-000',
    )
  })

  it('Should calculate cart (subtotal, tax, total) correctly', async () => {
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

    expect(await screen.findByText('$ 451.00')).toBeInTheDocument()
    expect(await screen.findByText('$ 103.73')).toBeInTheDocument()
    expect(await screen.findByText('$ 554.73')).toBeInTheDocument()
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
    const submitButton = await screen.findByRole('button', {
      name: /Confirm order/i,
    })

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

    await user.type(await screen.findByLabelText(/Full name/i), 'Vincent')
    await user.type(await screen.findByLabelText(/Email/i), 'v@nightcity.nc')
    await user.type(await screen.findByLabelText(/Shipping address/i), 'H10')
    await user.type(await screen.findByLabelText(/City/i), 'Night City')
    await user.type(await screen.findByLabelText(/Zip code/i), '00-000')
    await user.type(await screen.findByLabelText(/Phone number/i), '123456789')

    const submitButton = await screen.findByRole('button', {
      name: /Confirm order/i,
    })
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

  it('Should generate and include security token in form payload', async () => {
    render(<CheckoutForm userEmail={null} canceled={false} draftData={null} />)
    const user = userEvent.setup()

    const submitButton = await screen.findByRole('button', {
      name: /Confirm order/i,
    })
    await user.click(submitButton)

    await waitFor(() => {
      expect(checkout).toHaveBeenCalled()
    })

    const calls = vi.mocked(checkout).mock.calls
    const formData = calls[calls.length - 1][2] as FormData

    const token = formData.get('orderToken')

    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
    expect((token as string).length).toBeGreaterThan(10)
  })

  it('Should correctly display Rate Limit error', async () => {
    const rateLimitError =
      'Uplink rejected: Rate limit exceeded. Try again in 60s.'

    vi.mocked(checkout).mockResolvedValueOnce({
      error: [rateLimitError],
      fields: {},
    })

    render(<CheckoutForm userEmail={null} canceled={false} draftData={null} />)
    const user = userEvent.setup()

    const submitButton = await screen.findByRole('button', {
      name: /Confirm order/i,
    })
    await user.click(submitButton)

    expect(
      await screen.findByText('[ ! ] Uplink_rejected: Data_corrupted'),
    ).toBeInTheDocument()
    expect(await screen.findByText(rateLimitError)).toBeInTheDocument()
  })

  it('Should correctly display duplicate transaction error', async () => {
    const duplicateError =
      'Uplink rejected: Duplicate transaction detected. Please wait'

    vi.mocked(checkout).mockResolvedValueOnce({
      error: [duplicateError],
      fields: {},
    })

    render(<CheckoutForm userEmail={null} canceled={false} draftData={null} />)
    const user = userEvent.setup()

    const submitButton = await screen.findByRole('button', {
      name: /Confirm order/i,
    })
    await user.click(submitButton)

    expect(await screen.findByText(duplicateError)).toBeInTheDocument()
  })
})

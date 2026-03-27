import { CheckoutForm } from '@/app/checkout/_components/checkout-form'
import { useCart } from '@/hooks'
import { checkout } from '@/lib/actions'
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
    type MockState = {
      slug: string
      price: number
      quantity: number
      name: string
      imgSrc: string
    }

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
})

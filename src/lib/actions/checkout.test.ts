import { checkout } from '@/lib/actions/checkout'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    order: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}))

vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  }),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Checkout backend', () => {
  it('Should return error when validation is fails', async () => {
    const formData = new FormData()
    const result = await checkout([], { error: [], fields: {} }, formData)

    const emailError = result.error.find((err) =>
      err.toLowerCase().includes('email'),
    )

    expect(emailError).toBeDefined()
  })

  it('Should return missing product information', async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([])

    const formData = new FormData()
    formData.append('fullName', 'Johnny Silverhand')
    formData.append('email', 'johnny@samurai.nc')
    formData.append('shippingAddress', 'Afterlife')
    formData.append('city', 'Night City')
    formData.append('zipCode', 'NC-77')
    formData.append('phone', '555-000-000')

    const result = await checkout(
      [
        {
          id: '123',
          quantity: 1,
          cartId: 'cart-1',
          productSlug: 'test-product',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { error: [], fields: {} },
      formData,
    )

    expect(result.error).toContain(
      'Uplink rejected: Product test-product not found',
    )

    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled()
  })

  it('Should return quantity error', async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([
      {
        id: '123',
        name: 'Test Product',
        quantity: 2,
        slug: 'test-product',
        createdAt: new Date(),
        badge: null,
        price: 99.99,
        specification: {},
        performance: {},
        categoryId: 'cat-1',
        createdById: null,
      },
    ])

    const formData = new FormData()
    formData.append('fullName', 'Johnny Silverhand')
    formData.append('email', 'johnny@samurai.nc')
    formData.append('shippingAddress', 'Afterlife')
    formData.append('city', 'Night City')
    formData.append('zipCode', 'NC-77')
    formData.append('phone', '555-000-000')

    const result = await checkout(
      [
        {
          id: '123',
          quantity: 3,
          cartId: 'cart-1',
          productSlug: 'test-product',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { error: [], fields: {} },
      formData,
    )

    expect(result.error).toContain(
      'Uplink rejected: Insufficient stock for Test Product',
    )

    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled()
  })

  it('Should convert and send correct price to Stripe', async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([
      {
        id: '123',
        name: 'Test Product',
        quantity: 20,
        slug: 'test-product',
        createdAt: new Date(),
        badge: null,
        price: 99.99,
        specification: {},
        performance: {},
        categoryId: 'cat-1',
        createdById: null,
      },
    ])

    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      url: 'https://stripe.com/success',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    vi.mocked(prisma.$transaction).mockResolvedValue({ id: '123' })

    const formData = new FormData()
    formData.append('fullName', 'Johnny Silverhand')
    formData.append('email', 'johnny@samurai.nc')
    formData.append('shippingAddress', 'Afterlife')
    formData.append('city', 'Night City')
    formData.append('zipCode', 'NC-77')
    formData.append('phone', '555-000-000')

    try {
      await checkout(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [{ productSlug: 'test-product', quantity: 3 } as any],
        { error: [], fields: {} },
        formData,
      )
    } catch (error) {}

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 9999,
              currency: 'usd',
            }),
            quantity: 3,
          }),
        ],
      }),
    )
  })

  it('Should decrease amount and create order after successful checkout', async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([
      {
        id: '123',
        name: 'Test Product',
        quantity: 20,
        slug: 'test-product',
        createdAt: new Date(),
        badge: null,
        price: 99.99,
        specification: {},
        performance: {},
        categoryId: 'cat-1',
        createdById: null,
      },
    ])

    vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
      return await callback(prisma)
    })

    const formData = new FormData()
    formData.append('fullName', 'Johnny Silverhand')
    formData.append('email', 'johnny@samurai.nc')
    formData.append('shippingAddress', 'Afterlife')
    formData.append('city', 'Night City')
    formData.append('zipCode', 'NC-77')
    formData.append('phone', '555-000-000')

    try {
      await checkout(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [{ productSlug: 'test-product', quantity: 3 } as any],
        { error: [], fields: {} },
        formData,
      )
    } catch (error) {}

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: {
        quantity: {
          decrement: 3,
        },
      },
    })
    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          fullName: 'Johnny Silverhand',
          totalAmount: expect.closeTo(299.97, 2),
        }),
      }),
    )
  })

  it('Should redirect user on success', async () => {
    const mockStripeUrl = 'https://stripe.com/success'
    vi.mocked(prisma.$transaction).mockResolvedValue({ id: '123' })

    vi.mocked(prisma.product.findMany).mockResolvedValue([
      {
        id: '123',
        name: 'Test Product',
        quantity: 20,
        slug: 'test-product',
        createdAt: new Date(),
        badge: null,
        price: 99.99,
        specification: {},
        performance: {},
        categoryId: 'cat-1',
        createdById: null,
      },
    ])

    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      url: mockStripeUrl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    vi.mocked(prisma.$transaction).mockResolvedValue({ id: '123' })

    const formData = new FormData()
    formData.append('fullName', 'Johnny Silverhand')
    formData.append('email', 'johnny@samurai.nc')
    formData.append('shippingAddress', 'Afterlife')
    formData.append('city', 'Night City')
    formData.append('zipCode', 'NC-77')
    formData.append('phone', '555-000-000')

    try {
      await checkout(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [{ productSlug: 'test-product', quantity: 3 } as any],
        { error: [], fields: {} },
        formData,
      )
    } catch (error) {}

    expect(stripe.checkout.sessions.create).toHaveBeenCalled()
    const { redirect } = await import('next/navigation')
    expect(redirect).toHaveBeenCalledWith(mockStripeUrl)
  })
})

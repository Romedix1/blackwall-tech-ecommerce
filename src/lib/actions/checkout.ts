'use server'

import { checkoutSchema } from '@/lib/zod'
import { FormState } from '@/types'
import { CartItem } from '../../../generated/prisma'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function checkout(
  items: CartItem[],
  prevState: FormState,
  formData: FormData,
) {
  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  const validatedData = checkoutSchema.safeParse(rawData)

  if (!validatedData.success) {
    const errorArray = validatedData.error.issues.map((issue) => issue.message)

    return { error: errorArray, fields: rawData }
  } else if (validatedData && validatedData.success) {
    const cookieStore = await cookies()

    cookieStore.set({
      name: 'blackwall_checkout_form',
      value: JSON.stringify(validatedData.data),
      maxAge: 60 * 10,
    })
  }

  let sessionUrl = ''
  let inventoryError = null

  try {
    const productSlugs = items.map((item) => item.productSlug)

    const dbProducts = await prisma.product.findMany({
      where: { slug: { in: productSlugs } },
    })

    const stripeLineitems = []

    for (const item of items) {
      const realProduct = dbProducts.find(
        (product) => product.slug === item.productSlug,
      )

      if (!realProduct) {
        inventoryError = `Uplink rejected: Product ${item.productSlug} not found`
        break
      } else if (item.quantity > realProduct.quantity) {
        inventoryError = `Uplink rejected: Insufficient stock for ${realProduct.name}`
        break
      }

      stripeLineitems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: realProduct.name,
          },
          unit_amount: Math.round(realProduct.price * 100),
        },
        quantity: item.quantity,
      })
    }

    if (inventoryError) {
      return { error: [inventoryError], fields: rawData }
    }

    // [ ARCHITECTURE NOTE FOR REVIEWERS ]
    // Stripe Tax (automatic_tax) is intentionally disabled in this portfolio project.
    // Enabling it requires configuring legal tax registrations and physical origin addresses
    // In a production environment, this would be handled via Stripe Tax API based on customer location.

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: stripeLineitems,
      customer_email: validatedData.data.email,
      metadata: {
        customerName: validatedData.data.fullName,
        address: validatedData.data.shippingAddress,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    })

    if (!session.url) {
      throw new Error('Stripe failed to return a session URL')
    }

    sessionUrl = session.url
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(' [ STRIPE_PAYMENT_ERROR ]:', error)
    }
    return {
      error: ['Critical error: System data mismatch or connection failed'],
      fields: rawData,
    }
  }

  redirect(sessionUrl)
}

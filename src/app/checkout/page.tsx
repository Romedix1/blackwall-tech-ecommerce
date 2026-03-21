import { CheckoutForm } from '@/app/checkout/_components/checkout-form'
import { ProductsSummary } from '@/app/checkout/_components/products-summary'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto mt-6 justify-between lg:mt-12 lg:flex lg:gap-24">
      <ProductsSummary />
      <CheckoutForm />
    </div>
  )
}

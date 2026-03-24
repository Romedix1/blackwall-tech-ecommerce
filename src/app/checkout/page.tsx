import { CheckoutForm } from '@/app/checkout/_components/checkout-form'
import { ProductsSummary } from '@/app/checkout/_components/products-summary'
import { auth } from '@/auth'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Checkout',
  robots: {
    index: false,
    follow: false,
  },
}

type CheckoutPageProps = {
  searchParams: Promise<{ canceled?: string }>
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const resolvedSearchParams = await searchParams

  const isCanceled = resolvedSearchParams.canceled === 'true'

  const cookieStore = await cookies()
  const formDataCookie = cookieStore.get('blackwall_checkout_form')

  let draftData = null

  if (isCanceled && formDataCookie) {
    try {
      draftData = JSON.parse(formDataCookie.value)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ DRAFT_DATA_ERROR ]: ', error)
      }
    }
  }

  const session = await auth()

  const userEmail = session?.user?.email

  return (
    <div className="container mx-auto mt-6 justify-between lg:mt-12 lg:flex lg:gap-24">
      <ProductsSummary />
      <CheckoutForm
        canceled={isCanceled}
        userEmail={userEmail}
        draftData={draftData}
      />
    </div>
  )
}

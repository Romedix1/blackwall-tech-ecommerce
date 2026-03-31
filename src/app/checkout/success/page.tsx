import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Terminal, XCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib'
import Stripe from 'stripe'
import { StatusWatcher } from '@/app/checkout/success/_components/status-watcher'
import { CartCleaner } from '@/app/checkout/success/_components/cart-cleaner'

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id: string }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id } = await searchParams

  if (!session_id) {
    redirect('/')
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['payment_intent'],
  })

  const order = await prisma.order.findFirst({
    where: { stripeSessionId: session_id },
    select: {
      id: true,
    },
  })

  if (!order?.id) {
    redirect('/')
  }

  const paymentIntent = session.payment_intent as Stripe.PaymentIntent
  const isPaid = session.payment_status === 'paid'
  const isProcessing =
    session.payment_status === 'unpaid' &&
    (paymentIntent?.status === 'processing' ||
      paymentIntent?.status === 'requires_action')

  const currentTimestamp = new Date().toISOString()

  const renderStatusLogs = () => {
    if (isPaid) {
      return (
        <>
          <p className="text-accent">
            <span aria-hidden="true">
              [{currentTimestamp}] ASSETS_ALLOCATED_TO_OPERATIVE
            </span>
            <span className="sr-only">
              Status: Assets allocated to operative
            </span>
          </p>
          <p className="text-accent animate-pulse font-bold">
            <span aria-hidden="true">
              &gt; STATUS: STABLE_CONNECTION_ESTABLISHED
            </span>
            <span className="sr-only">
              Current Status: stable connection established
            </span>
          </p>
        </>
      )
    }

    if (isProcessing) {
      return (
        <p className="animate-pulse font-bold text-yellow-500">
          <span aria-hidden="true">
            &gt; WARNING: UPLINK_IN_PROGRESS_WAITING_FOR_BANK_CONFIRMATION...
          </span>
          <span className="sr-only">
            Status: Payment processing, waiting for confirmation
          </span>
        </p>
      )
    }

    return (
      <p className="text-error-text font-bold">
        <span aria-hidden="true">
          &gt; ERROR: TRANSACTION_REJECTED_BY_MAINFRAME
        </span>
        <span className="sr-only">Error: Transaction rejected</span>
      </p>
    )
  }

  return (
    <div className="container mx-auto mt-12 max-w-5xl border">
      {isPaid && <CartCleaner />}
      {isProcessing && <StatusWatcher orderId={order.id} />}

      <div className="bg-surface flex items-center justify-between border border-b p-3">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-accent" />
          <span className="text-text-second text-xs tracking-widest uppercase">
            System_Response
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="bg-text-disabled h-2 w-2 rounded-full" />
          <div className="bg-text-disabled h-2 w-2 rounded-full" />
          <div className="bg-accent h-2 w-2 rounded-full" />
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="mb-10 flex flex-col items-center text-center">
          <div
            className={cn(
              'mb-4 flex h-16 w-16 items-center justify-center rounded-full border',
              isPaid
                ? 'border-accent/20 bg-accent/10'
                : isProcessing
                  ? 'border-yellow-500/20 bg-yellow-500/10'
                  : 'border-error-text/20 bg-error-text/10',
            )}
          >
            {isPaid ? (
              <CheckCircle2 size={32} className="text-accent" />
            ) : (
              <XCircle
                size={32}
                className={isProcessing ? 'text-warning' : 'text-error-text'}
              />
            )}
          </div>

          <h1
            className={cn(
              'text-xl font-bold tracking-tighter uppercase',
              isPaid
                ? 'text-accent'
                : isProcessing
                  ? 'text-warning'
                  : 'text-error-text',
            )}
          >
            <span aria-hidden="true">
              &gt; TRANSACTION_
              {isPaid ? 'AUTHORIZED' : isProcessing ? 'PROCESSING' : 'FAILED'}_
            </span>
            <span className="sr-only">
              Transaction{' '}
              {isPaid ? 'authorized' : isProcessing ? 'processing' : 'failed'}
            </span>
          </h1>

          <p className="text-text-second text-sm">
            <span className="uppercase" aria-hidden="true">
              Order_ID:
            </span>
            <span className="sr-only">Order ID:</span>{' '}
            <span className="text-text-second/70 break-all">{order.id}</span>
          </p>
        </div>

        <div
          className="bg-text-second/5 mb-8 space-y-1 rounded-sm border p-4 text-xs"
          role="log"
          aria-label="System status logs"
        >
          <p className="opacity-50">
            <span className="sr-only">Initializing uplink</span>
            <span aria-hidden="true">
              [{currentTimestamp}] INITIALIZING_UPLINK...
            </span>
          </p>

          <p className="opacity-70">
            <span aria-hidden="true">
              [{currentTimestamp}] VERIFYING_STRIPE_TOKEN...
            </span>
            <span className="sr-only">Verifying stripe token</span>
          </p>

          {renderStatusLogs()}
        </div>

        {isPaid && (
          <div className="border-accent bg-accent/5 mb-10 border-l-2 p-6">
            <h3 className="mb-1 text-sm font-bold text-white">
              ASSETS_DELIVERY_IN_PROGRESS
            </h3>
            <p className="text-text-second text-xs leading-relaxed">
              Your data has been transmitted to the mainframe. Check your
              encrypted email channel.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild className="flex items-center justify-center text-sm">
            <Link href="/dashboard/orders">
              <span className="sr-only">My orders</span>
              <span aria-hidden="true">[ My_orders ]</span>
            </Link>
          </Button>

          <Button
            variant="secondary"
            asChild
            className="flex items-center justify-center text-sm"
          >
            <Link href="/">
              <span className="sr-only">Return to homepage</span>
              <span aria-hidden="true">[ Return_to_main_page ]</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

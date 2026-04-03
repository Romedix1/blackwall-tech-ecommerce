'use client'

import { TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { useCart } from '@/hooks'
import { checkout } from '@/lib/actions'
import { useActionState, useEffect, useState } from 'react'
import { CartItem } from '../../../../generated/prisma'
import { cn } from '@/lib'

type draftDataType = {
  fullName: string
  shippingAddress: string
  email: string
  city: string
  zipCode: string
  phone: string
}

type CheckoutFormProps = {
  userEmail: string | null | undefined
  canceled: boolean
  draftData: draftDataType | null
}

export const CheckoutForm = ({
  userEmail,
  canceled,
  draftData,
}: CheckoutFormProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const items = useCart((state) => state.items)

  const total = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const tax = (total * 23) / 100
  const totalWithTax = total + tax

  const payloadItems = items.map((item) => ({
    productSlug: item.slug,
    quantity: item.quantity,
  }))

  const checkoutWithItems = checkout.bind(null, payloadItems as CartItem[])

  const [state, formAction, isPending] = useActionState(checkoutWithItems, null)
  const [orderToken] = useState(() => crypto.randomUUID())

  const isEmpty = items.length === 0
  const hasStockError = items.some((item) => {
    return item.stock !== undefined && item.quantity > item.stock
  })

  const canSubmit = !isEmpty && !isPending && !hasStockError

  const hasError = !!state?.error
  const showErrorMessage = hasError || (isEmpty && !isPending && isMounted)

  if (!isMounted) {
    return (
      <div className="bg-surface flex h-96 animate-pulse items-center justify-center p-4 text-center uppercase lg:w-115 lg:p-8 2xl:w-140">
        <span
          aria-hidden="true"
          className="text-accent font-bold tracking-wider break-all"
        >
          [ Establishing_secure_uplink... ]
        </span>
        <span className="sr-only">Loading secure checkout...</span>
      </div>
    )
  }

  return (
    <div className="bg-surface p-4 lg:w-115 lg:p-8 2xl:w-140">
      <h2 className="mb-6 lg:text-lg">
        <span aria-hidden="true" className="font-bold uppercase">
          {'// '}Uplink_authorization
        </span>
        <span className="sr-only">Uplink authorization</span>
      </h2>

      {canceled && (
        <div className="border-error-text text-error-text bg-error-bg/30 mb-6 border p-4 text-sm font-bold uppercase">
          <span aria-hidden="true">
            [ ! ] Uplink_aborted: Payment_cancelled_by_user
          </span>
          <span className="sr-only">
            Uplink aborted: Payment cancelled by user
          </span>
        </div>
      )}

      <p className="mb-6">
        <span aria-hidden="true" className="mr-2">
          &gt;
        </span>
        Subtotal: <span className="inline-block">$ {total.toFixed(2)}</span>
      </p>

      <div className="mb-6 flex w-full flex-col gap-4 uppercase">
        <p>
          <span aria-hidden="true" className="mr-2">
            &gt;
          </span>
          <span aria-hidden="true">Tax_protocol</span>
          <span className="sr-only">Tax protocol</span>:{' '}
          <span className="inline-block">$ {tax.toFixed(2)}</span>
        </p>

        <p className="text-accent">
          <span aria-hidden="true" className="mr-2">
            &gt;
          </span>
          <span aria-hidden="true">Final_payload</span>
          <span className="sr-only">Final payload</span>:{' '}
          <span className="inline-block">$ {totalWithTax.toFixed(2)}</span>
        </p>

        <p className="text-error-text text-xs font-bold">
          <span aria-hidden="true">
            [ ! ] // WARNING: SANDBOX_ENVIRONMENT. DO_NOT_ENTER_REAL_DATA
          </span>
          <span className="sr-only">
            Warning: sandbox environment. Do not enter real data
          </span>
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        <input
          className="hidden"
          name="orderToken"
          value={orderToken}
          readOnly
        />

        <TerminalInput
          defaultValue={state?.fields?.fullName || draftData?.fullName || ''}
          placeholder="Full_name"
          name="fullName"
          ariaLabel="Full name"
          className="pr-4"
        />
        <TerminalInput
          defaultValue={
            state?.fields.shippingAddress || draftData?.shippingAddress || ''
          }
          placeholder="Shipping_address"
          ariaLabel="Shipping address"
          name="shippingAddress"
          className="pr-4"
        />

        <TerminalInput
          defaultValue={
            state?.fields?.email || draftData?.email || userEmail || ''
          }
          placeholder="Email"
          ariaLabel="Email"
          name="email"
          className="pr-4"
        />

        <div className="grid w-full grid-cols-[3fr_2fr] gap-3">
          <TerminalInput
            placeholder="City"
            defaultValue={state?.fields.city || draftData?.city || ''}
            name="city"
            ariaLabel="City"
            className="pr-4"
          />
          <TerminalInput
            defaultValue={state?.fields.zipCode || draftData?.zipCode || ''}
            placeholder="Zip_code"
            name="zipCode"
            ariaLabel="Zip code"
            className="pr-4"
          />
        </div>

        <TerminalInput
          type="tel"
          defaultValue={state?.fields.phone || draftData?.phone || ''}
          placeholder="Phone_number"
          name="phone"
          ariaLabel="Phone number"
          className="pr-4"
        />

        <Button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            isPending
              ? 'cursor-wait!'
              : (isEmpty || hasStockError) && 'cursor-not-allowed!',
          )}
          aria-label={
            isPending
              ? 'Confirming'
              : isEmpty || hasStockError
                ? 'Empty cart'
                : 'Confirm order'
          }
        >
          <span aria-hidden="true">
            [{' '}
            {isPending
              ? 'Confirming'
              : isEmpty || hasStockError
                ? 'Cart_empty'
                : 'Confirm_order'}{' '}
            ]
          </span>
          <span className="sr-only">
            {isPending ? 'Confirming' : 'Confirm order'}
          </span>
        </Button>

        {showErrorMessage && (
          <div className="border-error-text text-error-text mt-6 border p-4 text-sm uppercase">
            <p className="mb-2 font-bold">
              <span aria-hidden="true">
                [ ! ] Uplink_rejected: Data_corrupted
              </span>
              <span className="sr-only">Uplink rejected: Data corrupted</span>
            </p>

            <ul className="list-none">
              {state?.error &&
                state.error.map((err: string, index: number) => (
                  <li key={index}>
                    <span aria-hidden="true" className="mr-3">
                      &gt;
                    </span>
                    {err}
                  </li>
                ))}
              {isEmpty && (
                <li>
                  <span aria-hidden="true" className="mr-3">
                    &gt;
                  </span>
                  No items detected in cart
                </li>
              )}
            </ul>
          </div>
        )}
      </form>

      <p className="text-text-second mt-6 text-sm break-all uppercase">
        <span aria-hidden="true">{'//'} No_actual_charges_will_be_made</span>
        <span className="sr-only">No actual charges will be made</span>
      </p>
    </div>
  )
}

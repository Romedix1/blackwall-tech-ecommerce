'use client'

import { TerminalInput } from '@/components/shared'
import { Button, Input } from '@/components/ui'
import { useCart } from '@/hooks'

export const CheckoutForm = () => {
  const items = useCart((state) => state.items)

  const total = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  )

  const tax = (total * 23) / 100

  const totalWithTax = total + tax

  return (
    <div className="bg-surface p-4 lg:w-115 lg:p-8 2xl:w-140">
      <h2 className="mb-6 lg:text-lg">
        <span aria-hidden="true" className="font-bold uppercase">
          {'// '}Uplink_authorization
        </span>
        <span className="sr-only">Uplink authorization</span>
      </h2>

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
            ! Warning: sandbox environment. Do not enter real data
          </span>
        </p>
      </div>

      <form className="flex flex-col gap-6">
        <TerminalInput placeholder="Full_name" ariaLabel="Full name" />
        <TerminalInput placeholder="Shipping_address" ariaLabel="address" />
        <TerminalInput
          placeholder="Credit_card_number"
          ariaLabel="Credit card number"
        />

        <div className="grid w-full grid-cols-[2fr_1fr] gap-3 sm:grid-cols-[3fr_1fr]">
          <TerminalInput placeholder="Exp_date" ariaLabel="Expiration date" />
          <TerminalInput
            placeholder="Cvv"
            name="cvv"
            ariaLabel="Cvv"
            className="pr-4"
          />
        </div>

        <Button>
          <span aria-hidden="true">[ Confirm_order ]</span>
          <span className="sr-only">Confirm order</span>
        </Button>
      </form>

      <p className="text-text-second mt-6 text-sm break-all uppercase">
        <span aria-hidden="true">{'//'} No_actual_charges_will_be_made</span>
        <span className="sr-only">No actual charges will be made</span>
      </p>
    </div>
  )
}

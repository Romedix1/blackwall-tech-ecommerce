'use client'

import { QuantityError } from '@/components/ui'
import { useCart } from '@/hooks'

export const ProductsSummary = () => {
  const items = useCart((state) => state.items)

  return (
    <section className="lg:w-6/12">
      <h2 className="mb-6 xl:text-lg">
        <span
          aria-hidden="true"
          className="text-text-main font-bold tracking-widest uppercase"
        >
          {'// '}Hardware_manifest
        </span>
        <span className="sr-only">hardware manifest</span>
      </h2>

      <div className="text-text-second mb-8 flex flex-col gap-4 text-sm lg:text-base">
        {items.map((item) => {
          const total = item.price * item.quantity

          return (
            <div key={item.slug}>
              <div className="flex w-full items-end gap-2">
                <div className="uppercase">
                  <span aria-hidden="true" className="mr-2">
                    &gt;
                  </span>
                  <span className="wrap-break-word">{item.name} </span>
                  {item.quantity > 1 && (
                    <span className="text-accent ml-2">x{item.quantity}</span>
                  )}
                </div>

                <div className="border-text-disabled mb-1.5 min-w-4 grow border-b-2 border-dotted" />

                <p className="text-text-main shrink-0 whitespace-nowrap">
                  $ {total.toFixed(2)}
                </p>
              </div>
              {item.quantity > (item.stock ?? Infinity) && (
                <QuantityError stock={item.stock ?? Infinity} />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

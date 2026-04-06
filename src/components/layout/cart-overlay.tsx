'use client'

import { AmountButton } from '@/components/shared'
import { Button, Separator } from '@/components/ui'
import { QuantityError } from '@/components/ui/quantity-error'
import { useCart } from '@/hooks'
import { fetchCartFromDb } from '@/lib/actions'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
// TODO: ADD IMAGE/PRODUCT LOADING SKELETON
// TODO: CLEAR CART FOR LOGGED USER
export const CartOverlay = () => {
  const { isOpen, toggle, updateQuantity, removeItem, setCart } = useCart()

  const { status } = useSession()
  const isAuth = status === 'authenticated'

  const items = useCart((state) => state.items)

  const [isHydrating, setIsHydrating] = useState(false)

  useEffect(() => {
    const hydrateCart = async () => {
      if (isAuth) {
        setIsHydrating(true)
        try {
          const dbItems = await fetchCartFromDb()
          if (dbItems && dbItems.length > 0) {
            setCart(dbItems)
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[ HYDRATION_ERROR ]:', error)
          }
        } finally {
          setIsHydrating(false)
        }
      }
    }

    hydrateCart()
  }, [isAuth, setCart])

  const total =
    items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0

  const handleRemove = (slug: string) => {
    removeItem(slug, isAuth)
  }

  const canCheckout = items.length > 0

  return (
    <>
      <div
        className={cn(
          `fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200 ease-in-out`,
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
        onClick={toggle}
      />

      <div
        className={cn(
          `bg-surface fixed top-0 right-0 z-50 flex h-screen w-screen flex-col transition-transform duration-200 ease-in-out lg:w-5/12`,
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <h4 className="text-accent text-sm font-bold uppercase 2xl:text-base">
              <span aria-hidden="true">{'//'} Active_inventory</span>
              <span className="sr-only">Active inventory</span>
            </h4>

            <button
              onClick={toggle}
              className="text-text-second hover:text-error-text focus:text-error-text cursor-pointer text-xs uppercase outline-none 2xl:text-sm"
            >
              <span aria-hidden="true">[ X_close ]</span>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <Separator className="my-6" />
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="flex flex-col gap-8">
            {isHydrating ? (
              <div className="flex h-full items-center justify-center py-20">
                <p className="text-accent text-xs font-bold tracking-widest uppercase 2xl:text-sm">
                  <span aria-hidden="true">{'//'} Fetching_records...</span>
                  <span className="sr-only">Loading cart data from server</span>
                </p>
              </div>
            ) : items && items.length > 0 ? (
              items.map((item) => {
                return (
                  <div
                    key={item.slug}
                    className="flex flex-col gap-4 border-b pb-8 last:border-0 last:pb-4"
                  >
                    <h5 className="text-text-main text-sm font-bold tracking-widest uppercase 2xl:text-base">
                      {item.name}
                    </h5>

                    <div className="flex items-center gap-6">
                      <div className="relative flex h-20 w-24 shrink-0 items-center justify-center 2xl:h-32 2xl:w-36">
                        <Image
                          src={item.imgSrc}
                          width={144}
                          height={144}
                          alt={item.name}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-accent text-xl font-bold">
                        $ {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <AmountButton
                        quantity={item.quantity}
                        slug={item.slug}
                        stock={item.stock ?? Infinity}
                        handleUpdate={updateQuantity}
                        className="w-fit justify-start border-none bg-transparent p-0 text-sm 2xl:text-base"
                      />

                      <button
                        onClick={() => handleRemove(item.slug)}
                        className="text-error-text hover:text-error-text/60 focus:text-error-text/60 cursor-pointer text-xs font-bold tracking-widest uppercase outline-none 2xl:text-sm"
                      >
                        <span aria-hidden="true">[ Remove ]</span>
                        <span className="sr-only">Remove</span>
                      </button>
                    </div>

                    {item.stock !== undefined && item.quantity > item.stock && (
                      <QuantityError stock={item.stock} />
                    )}
                  </div>
                )
              })
            ) : (
              <p className="text-text-second text-center text-xs tracking-widest uppercase 2xl:text-lg">
                Inventory is empty
              </p>
            )}
          </div>
        </div>

        <div className="border border-t p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-text-second text-sm font-bold uppercase 2xl:text-base">
              Subtotal:
            </p>
            <p className="text-accent text-2xl font-bold">
              $ {total.toFixed(2)}
            </p>
          </div>

          <Button
            asChild
            disabled={!canCheckout}
            className={cn(
              'disabled:bg-primary-active/60! block w-full py-4 text-center',
              !canCheckout && 'cursor-not-allowed!',
            )}
          >
            {canCheckout ? (
              <Link href="/checkout" onClick={toggle}>
                <span aria-hidden="true">[ Initialize_checkout ]</span>
                <span className="sr-only">Initialize checkout</span>
              </Link>
            ) : (
              <button>
                <span aria-hidden="true">[ System_locked: No_items ]</span>
                <span className="sr-only">Locked: no items</span>
              </button>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

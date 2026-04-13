'use client'

import { AmountButton } from '@/components/shared'
import { Button, ImageNotFound } from '@/components/ui'
import { useBuilder } from '@/hooks/use-builder'
import { SpecSection } from '@/types'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'

type productType = {
  slug: string
  name: string
  price: number
  productImg: string | null
  specification: SpecSection[]
  quantity: number
  technical: Record<string, string>
  category: string
}

type ProductBlockProps = {
  product: productType
}

export const ProductBlock = ({ product }: ProductBlockProps) => {
  const { items, addItem, removeItem, updateQuantity } = useBuilder()

  const { status } = useSession()
  const isLogged = status === 'authenticated'

  const isSelected = items.find((item) => item.slug === product.slug)

  const [quantity, setQuantity] = useState(isSelected?.quantity || 1)

  return (
    <div
      key={product.slug}
      className="bg-surface flex flex-col gap-6 border px-6 py-4 sm:gap-12"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative aspect-video h-30 w-full shrink-0 sm:w-fit xl:h-36">
            {product.productImg ? (
              <Image
                src={product.productImg}
                alt={product.name}
                fill
                priority={false}
                className="object-contain"
              />
            ) : (
              <ImageNotFound />
            )}
          </div>

          <div>
            <p className="font-bold xl:text-lg">{product.name}</p>
            <p className="text-accent mt-4 hidden text-lg font-bold sm:block xl:text-xl">
              $ {product.price.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 xl:grid-cols-2">
          {(product.specification as SpecSection[]).map((section) => (
            <div key={section.id} className="flex flex-col gap-2">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="bg-accent h-px w-2"></span>
                <h4 className="text-text-second text-xs tracking-widest uppercase xl:text-sm">
                  {section.label}
                </h4>
              </div>

              <div className="flex flex-col gap-1">
                {section.attributes.map((item) => (
                  <div
                    key={`${section.id}-${item.key}`}
                    className="flex justify-between pb-1 text-xs xl:text-sm"
                  >
                    <span className="text-text-second/80 mr-4 uppercase">
                      {item.key.replace('_', ' ')}
                    </span>
                    <span className="text-right font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-accent text-lg font-bold sm:hidden">
          $ {product.price.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 lg:flex-row-reverse lg:gap-4">
        {isSelected && (
          <AmountButton
            handleUpdate={updateQuantity}
            className="h-14 w-full"
            slug={product.slug}
            stock={product.quantity}
            quantity={isSelected.quantity || quantity}
            setQuantity={setQuantity}
          />
        )}
        <Button
          variant={isSelected ? 'delete' : 'primary'}
          onClick={() =>
            isSelected
              ? removeItem(product.slug, isLogged)
              : addItem(
                  product.slug,
                  product.name,
                  product.price,
                  quantity,
                  product.productImg,
                  product.category,
                  product.technical,
                  product.quantity,
                  isLogged,
                )
          }
        >
          {isSelected ? (
            <>
              <span aria-hidden="true">[ Remove_part ]</span>
              <span className="sr-only">Remove part</span>
            </>
          ) : (
            <>
              <span aria-hidden="true">[ Select_part ]</span>
              <span className="sr-only">Select part</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

import { Button, ImageNotFound } from '@/components/ui'
import { SpecSection } from '@/types'
import Image from 'next/image'

type productType = {
  id: string
  name: string
  price: number
  specification: SpecSection[]
}

type ProductBlockProps = {
  product: productType
  productImg: string | null
}

export const ProductBlock = ({ product, productImg }: ProductBlockProps) => {
  return (
    <div
      key={product.id}
      className="bg-surface flex flex-col gap-6 border px-6 py-4 sm:gap-12"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative aspect-video h-30 w-full shrink-0 sm:w-fit xl:h-36">
            {productImg ? (
              <Image
                src={productImg}
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

      <Button>
        <span aria-hidden="true">[ Select_part ]</span>
        <span className="sr-only">Select part</span>
      </Button>
    </div>
  )
}

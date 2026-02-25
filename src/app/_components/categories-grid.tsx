import { CategoriesCard } from '@/app/_components'
import Image from 'next/image'
import GraphicCard from '@public/hero/graphic-card.png'
import KeyboardWithMouse from '@public/hero/keyboard-with-mouse.png'
import Processor from '@public/hero/processor.png'
import Memory from '@public/hero/memory.png'
import { cn } from '@/lib/utils'
import { BackgroundGlow } from '@/components/ui'

type ProductShadowProps = {
  className?: string
}

const ProductShadow = ({ className }: ProductShadowProps) => {
  return (
    <div
      className={cn(
        'bg-background absolute rounded-full blur-[10px]',
        className,
      )}
    ></div>
  )
}

export const CategoriesGrid = () => {
  const cardImageClass = 'z-30 absolute -right-[20%] xl:w-[650px] -bottom-[4%]'

  const CATEGORIES_CARDS = [
    {
      name: 'Graphics cards',
      className: 'lg:col-span-2',
      image: (
        <div className="relative aspect-4/3 rotate-8">
          <Image
            src={GraphicCard}
            alt="Graphic card"
            className={cn(cardImageClass, 'w-full rotate-355 xl:w-225')}
            width={1600}
            height={1200}
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
            quality={95}
          />
          <BackgroundGlow className="bg-accent/30 top-[65%] left-[70%] h-[60%] w-[90%] rotate-20 blur-2xl group-hover:scale-125 group-focus:scale-125 lg:blur-[180px]" />
          <ProductShadow className="absolute top-[60%] left-[40%] z-20 h-[20%] w-[70%] rotate-24 lg:top-[60%] lg:rotate-26" />
        </div>
      ),
    },
    {
      name: 'Peripherals',
      className: 'lg:row-span-2',
      image: (
        <div className="relative aspect-4/3 rotate-8">
          <Image
            src={KeyboardWithMouse}
            alt="Keyboard with mouse"
            className={cn(
              cardImageClass,
              'top-[3%] -right-[10%] w-full scale-150 lg:top-full lg:right-[2%] lg:scale-240 lg:rotate-345',
            )}
            width={2000}
            height={1500}
            sizes="(max-width: 1024px) 100vw, 1500px"
            priority
            quality={100}
          />

          <BackgroundGlow className="bg-accent/30 top-[80%] left-[60%] h-[70%] w-[95%] rotate-152 blur-2xl group-hover:scale-125 group-focus:scale-125 lg:top-[170%] lg:left-[60%] lg:h-[90%] lg:w-[130%] lg:rotate-155 xl:blur-[180px]" />
          <ProductShadow className="absolute top-[65%] left-[20%] z-20 h-[30%] w-[85%] rotate-150 lg:top-[170%] lg:-left-[10%] lg:w-[140%] lg:rotate-315" />
          <ProductShadow className="absolute top-[40%] left-[85%] z-20 h-[20%] w-[40%] rotate-10 lg:top-full" />
        </div>
      ),
    },
    {
      name: 'Processors',
      image: (
        <div className="relative aspect-4/3 rotate-8">
          <Image
            src={Processor}
            alt="Processor"
            className={cn(cardImageClass, 'top-[5%] w-full scale-125')}
            width={1200}
            height={1000}
            sizes="(max-width: 1024px) 100vw, 600px"
            quality={90}
          />

          <BackgroundGlow className="bg-accent/30 top-[80%] left-[60%] h-[70%] w-[95%] rotate-152 blur-2xl group-hover:scale-125 group-focus:scale-125 xl:blur-[180px]" />
          <ProductShadow className="absolute top-[55%] left-[40%] z-20 h-[50%] w-[70%] rotate-165" />
        </div>
      ),
    },
    {
      name: 'Memory',
      image: (
        <div className="relative aspect-4/3 rotate-8">
          <Image
            src={Memory}
            alt="Memory"
            className={cn(
              cardImageClass,
              'top-[2%] left-[17%] w-full scale-130',
            )}
            width={1200}
            height={1000}
            sizes="(max-width: 1024px) 100vw, 600px"
            quality={90}
          />

          <BackgroundGlow className="bg-accent/30 top-[90%] left-[75%] h-[70%] w-[95%] rotate-152 blur-2xl group-hover:scale-125 group-focus:scale-125 xl:blur-[180px]" />
          <ProductShadow className="absolute top-[90%] left-[50%] z-20 h-[15%] w-[30%] rotate-155" />
          <ProductShadow className="absolute top-[45%] left-[70%] z-20 h-[30%] w-[40%] rotate-170" />
        </div>
      ),
    },
  ]
  // TODO: FETCH CATEGORIES PRODUCT COUNT

  return (
    <div className="flex flex-col gap-4 sm:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {CATEGORIES_CARDS.map((category, index) => {
        return (
          <CategoriesCard
            className={category.className}
            key={`category-card-${index}`}
            index={index + 1}
            name={category.name}
            image={category.image}
          />
        )
      })}
    </div>
  )
}

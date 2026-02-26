import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'

type CategoryType = {
  name: string
  image: ReactNode
}

type CategoriesCardProps = {
  index: number
  className?: string
  category: CategoryType
}

export const CategoriesCard = ({
  index,
  className,
  category,
}: CategoriesCardProps) => {
  return (
    <Link
      href="/"
      className={cn(
        'border-accent/15 hover:border-accent focus:border-accent bg-surface group flex cursor-pointer flex-col gap-8 overflow-hidden border p-5 outline-none md:flex-1',
        className,
      )}
    >
      <div className="flex justify-between gap-4">
        <div className="flex flex-col xl:flex-row xl:gap-2">
          <div className="text-accent flex justify-between font-medium uppercase">
            <p className="text-xs xl:text-base">
              0{index}
              <span aria-hidden="true">/</span>
            </p>
          </div>
          <h3 className="text-2xl font-bold uppercase xl:text-[32px]">
            {category.name}
          </h3>
        </div>

        <p className="text-accent text-sm font-medium uppercase">
          <span aria-hidden="true">{'//'}</span> 44 items
        </p>
      </div>

      {category.image}
    </Link>
  )
}

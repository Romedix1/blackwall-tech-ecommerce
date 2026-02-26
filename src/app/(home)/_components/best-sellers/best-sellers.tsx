import { BestSellersContainer } from '@/app/(home)/_components/best-sellers'
import { Eyebrow } from '@/components/shared'
import { Button } from '@/components/ui'

export const BestSellers = () => {
  return (
    <section className="container mx-auto flex flex-col gap-4 overflow-hidden sm:px-4">
      <Eyebrow>
        <span aria-hidden="true">{`//`} Best_sellers</span>
        <span className="sr-only">Best sellers</span>
      </Eyebrow>

      <BestSellersContainer />

      <Button
        variant="secondary"
        className="border-border mt-8 text-xs sm:text-base"
      >
        <span aria-hidden="true">{'//'} ---</span>
        <span aria-hidden="true" className="hidden sm:inline-block">
          --------
        </span>
        <span aria-hidden="true" className="hidden lg:inline-block">
          ---------------
        </span>{' '}
        <span>
          <span aria-hidden="true">[ </span>
          <span aria-hidden="true" className="uppercase">
            View_all_products
          </span>
          <span className="sr-only">View all products</span>
          <span aria-hidden="true"> ]</span>
        </span>
        <span aria-hidden="true"> ---</span>
        <span aria-hidden="true" className="hidden sm:inline-block">
          --------
        </span>
        <span aria-hidden="true" className="hidden lg:inline-block">
          ---------------
        </span>{' '}
        <span aria-hidden="true">{'//'}</span>
      </Button>
    </section>
  )
}

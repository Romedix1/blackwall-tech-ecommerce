import { CategoriesGrid } from '@/app/_components'
import { Eyebrow } from '@/components/shared'

export const CategoriesSection = () => {
  return (
    <section className="container mx-auto flex flex-col gap-8 sm:px-4">
      <Eyebrow>
        <span aria-hidden="true">{`//`} Categories_browser</span>
        <span className="sr-only">Categories browser</span>
      </Eyebrow>

      <CategoriesGrid />
    </section>
  )
}

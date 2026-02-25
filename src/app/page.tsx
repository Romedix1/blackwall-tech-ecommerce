import { Hero } from '@/app/_components'
import { CategoriesSection } from '@/app/_components/categories-section'

export default function Home() {
  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      <Hero />
      <CategoriesSection />
    </div>
  )
}

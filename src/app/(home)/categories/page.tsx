import { PathNavigator } from '@/app/(home)/_components/path-navigator'
import { CategoriesContainer } from '@/app/(home)/_components/'

export default function CategoriesPage() {
  return (
    <div>
      <div className="container mx-auto mt-12">
        <PathNavigator />

        <header className="mt-4 mb-8">
          <h1 className="text-2xl font-extrabold tracking-tighter uppercase md:text-3xl lg:text-5xl">
            Hardware Archive
          </h1>
        </header>

        <CategoriesContainer />
      </div>
    </div>
  )
}

import { HeroActions, HeroContent, HeroImage } from '@/app/_components'

export const Hero = () => {
  return (
    <section className="container mx-auto mt-20 px-4 lg:mt-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <HeroContent />
        </div>

        <div className="flex justify-center lg:col-start-2 lg:row-span-2">
          <HeroImage />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <HeroActions />
        </div>
      </div>
    </section>
  )
}

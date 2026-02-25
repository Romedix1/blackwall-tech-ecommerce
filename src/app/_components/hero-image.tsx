import { BackgroundGlow } from '@/components/ui'
import Image from 'next/image'
import GraphicCard from '@public/hero/graphic-card.png'

export const HeroImage = () => {
  return (
    <div className="relative mt-8 w-125">
      <BackgroundGlow className="xl:h-72 xl:w-72 xl:-translate-y-2/6" />

      <div className="flex w-full justify-center xl:w-137.5">
        <Image
          src={GraphicCard}
          alt="Graphic card"
          className="relative z-20 sm:w-100 md:w-lg lg:w-102 xl:w-xl"
        />
      </div>
    </div>
  )
}

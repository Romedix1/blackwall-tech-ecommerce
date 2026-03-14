'use client'

import Image from 'next/image'
import pcImage from '@public/build-pc/pc.png'
import { HardwarePointer } from '@/app/(home)/_components/build-pc/ui'
import { BackgroundGlow, ImageCorner } from '@/components/ui'
import { useIsVisible } from '@/hooks/use-is-visible'

export const BuildPcImage = () => {
  const { ref, isVisible } = useIsVisible()

  return (
    <div ref={ref} className="relative mx-auto w-fit lg:mx-0">
      <Image
        alt="Computer visualization"
        className="relative z-20 block h-auto w-[288px] sm:w-137.5 lg:w-100 2xl:w-140"
        src={pcImage}
        width={1200}
        height={1000}
      />
      <ImageCorner className="absolute top-0 left-0 rotate-90" />
      <ImageCorner className="absolute top-0 right-0 rotate-180" />
      <ImageCorner className="absolute bottom-0 left-0" />
      <ImageCorner className="absolute right-0 bottom-0 rotate-270" />

      <BackgroundGlow className="z-10 h-36 w-36 blur-[54px] sm:top-[60%] sm:h-78 sm:w-78 md:blur-[100px]" />

      <HardwarePointer
        position="top-[35%] left-[57%] sm:top-[39%] lg:top-[39%] sm:left-[55%]"
        width="w-[100px] sm:w-[250px] lg:w-[190px]"
        text="Ram: 64GB DDR5"
        isVisible={isVisible}
      />

      <HardwarePointer
        position="top-[28%] left-[50%] sm:top-[32%] 2xl:top-[32%] lg:top-[30%]"
        width="w-[100px] sm:w-[250px] lg:w-[190px] 2xl:w-[240px]"
        text="CPU: RYZEN 9 9950X"
        isVisible={isVisible}
      />

      <HardwarePointer
        position="top-[35%] left-[0%] sm:left-[3%] 2xl:left-[7%] lg:top-[38%] sm:top-[40%]"
        width="w-[120px] sm:w-[230px] lg:w-[170px]"
        text="GPU: RTX 5090 TI"
        isVisible={isVisible}
        rotateToLeft={true}
      />

      <div className="w-full px-4 py-3 text-right text-xs sm:text-sm 2xl:text-base">
        <p className="uppercase">
          <span aria-hidden="true" className="text-text-second">
            {'// '}System_status: <span className="text-accent">Nominal</span>
          </span>
          <span className="text-text-second sr-only">
            System status: <span className="text-accent">Nominal</span>
          </span>
        </p>
        <p className="uppercase">
          <span aria-hidden="true" className="text-text-second">
            {'// '}Power_draw <span className="text-accent">850W</span>
          </span>
          <span className="text-text-second sr-only">
            Power draw: <span className="text-accent">850W</span>
          </span>
        </p>
      </div>
    </div>
  )
}

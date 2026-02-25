import { Eyebrow } from '@/components/shared'

export const HeroContent = () => {
  return (
    <div className="flex flex-col gap-3 lg:w-125 xl:w-155">
      <div className="flex w-fit items-center">
        <div className="animate-typing overflow-hidden whitespace-nowrap">
          <Eyebrow className="w-fit text-[16px] font-bold">
            <span aria-hidden="true">{`//`} next_gen e-commerce</span>
            <span className="sr-only">Next generation e-commerce</span>
          </Eyebrow>
        </div>

        <div className="animate-hide-cursor">
          <div
            className="bg-accent animate-blink h-5 w-3"
            style={{ animationDuration: '0.6s' } as React.CSSProperties}
          ></div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-[-4%] uppercase xl:text-[72px]">
          The apex of performance
        </h1>
        <p className="text-text-second text-[16px] leading-[160%] font-bold xl:text-xl">
          Precision engineered. Performance unleashed. Step into the next
          generation of hardware with the {"industry's"} leading graphics
          architecture, optimized for elite enthusiasts and creators.
        </p>
      </div>
    </div>
  )
}

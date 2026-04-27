'use client'

import { BuildLimitModal } from '@/app/(home)/_components/build-pc/build-limit-modal'
import { Button } from '@/components/ui'
import { initiateBuildConfig } from '@/lib/actions'
import { useState, useTransition } from 'react'

type BuildPcDescriptionProps = {
  buildsCount: number
}

export const BuildPcDescription = ({
  buildsCount,
}: BuildPcDescriptionProps) => {
  const [isPending, startTransition] = useTransition()
  const [isLimitReached, setIsLimitReached] = useState(false)

  const handleClick = () => {
    startTransition(async () => {
      if (buildsCount >= 5) {
        setIsLimitReached(true)
        return
      }

      await initiateBuildConfig()
    })
  }

  return (
    <div className="mt-8 font-medium uppercase lg:w-5/12">
      <p className="text-accent mb-1 text-xs sm:text-sm lg:mb-2 xl:mb-6 2xl:text-base">
        <span aria-hidden="true">{'// '}Custom_configuration_tool</span>
        <span className="sr-only">Custom configuration tool</span>
      </p>

      <h3 className="mb-4 text-2xl font-bold sm:w-10/12 sm:text-4xl 2xl:mb-12 2xl:text-5xl">
        Forge your ultimate machine
      </h3>

      <div className="text-xs sm:text-base 2xl:text-lg">
        <p className="text-text-second">
          <span aria-hidden="true">&gt; Select components</span>
        </p>
        <p className="text-text-second">
          <span aria-hidden="true">&gt; Verify compatibility</span>
        </p>
        <p className="text-text-second">
          <span aria-hidden="true">&gt; Optimize performance</span>
        </p>
      </div>

      {isLimitReached && (
        <BuildLimitModal onClose={() => setIsLimitReached(false)} />
      )}

      <Button
        onClick={handleClick}
        disabled={isPending}
        className="mt-6 flex items-center justify-center lg:w-full 2xl:h-20 2xl:text-xl"
      >
        <span aria-hidden="true">
          {isPending
            ? '[ Initializing_Protocol... ]'
            : '[ Start_configuration ]'}
        </span>
        <span className="sr-only">
          {isPending ? 'Initializing' : 'Start configuration'}
        </span>
      </Button>
    </div>
  )
}

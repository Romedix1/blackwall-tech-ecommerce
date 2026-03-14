import { SectionHeader } from '@/app/(home)/product/[productName]/_components'
import { BenchmarkType } from '@/types'

type PerformanceBenchmarkProps = {
  performance: BenchmarkType[]
}
const MAX_FPS = 160

export const PerformanceBenchmark = ({
  performance,
}: PerformanceBenchmarkProps) => {
  return (
    <div className="mt-12 flex flex-col gap-8 uppercase lg:mb-32 lg:gap-2">
      <SectionHeader text="Performance benchmarks" />

      <ul className="text-text-second flex flex-col gap-6">
        {performance.map((item) => {
          return (
            <li key={item.gameName} className="flex flex-col gap-2">
              <div className="flex justify-between text-xs uppercase lg:text-sm">
                <span className="flex">
                  {item.gameName}
                  <span className="ml-1.5" aria-hidden="true">
                    {'//'} {item.settings.replace(/\s+/g, '_')}
                  </span>
                  <span className="sr-only">{item.settings}</span>
                </span>

                <span className="text-sm">{item.fps} fps</span>
              </div>

              <div className="bg-surface h-2 w-full">
                <div
                  className="bg-accent relative z-10 h-2 shadow-[0_0_20px_var(--color-accent)]"
                  style={{
                    width: `${Math.min((item.fps / MAX_FPS) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

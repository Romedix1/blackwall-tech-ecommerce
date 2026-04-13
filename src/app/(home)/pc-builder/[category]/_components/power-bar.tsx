type PowerBarProps = {
  tdp: number
  maxTdp: number
  max: number
}

export const PowerBar = ({ tdp, maxTdp, max }: PowerBarProps) => {
  const safeMax = max <= 0 ? 1 : max

  const baseWidth = Math.min(Math.max((tdp / safeMax) * 100, 0), 100)
  const peakWidth = Math.min(Math.max((maxTdp / safeMax) * 100, 0), 100)

  return (
    <div className="flex flex-col gap-2">
      <p>
        <span aria-hidden="true" className="mr-2">
          &gt;
        </span>
        Pwr: {tdp}W / {max}W
      </p>
      <div className="bg-surface relative h-1 w-full">
        <div
          style={{ width: baseWidth + '%' }}
          className="bg-accent absolute z-10 h-full"
        ></div>
        <div
          style={{ width: peakWidth + '%' }}
          className="bg-error-text absolute h-full"
        ></div>
      </div>
    </div>
  )
}

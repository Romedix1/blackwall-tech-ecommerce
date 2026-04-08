type FilterCapsuleProps = {
  categoryKey: string
  option: string | number | undefined
}

export const FilterCapsule = ({ categoryKey, option }: FilterCapsuleProps) => {
  return (
    <button className="terminal-hover border px-3 py-2 text-sm whitespace-nowrap uppercase transition-colors outline-none">
      <span className="font-bold">{categoryKey}:</span> <span>{option}</span>
    </button>
  )
}

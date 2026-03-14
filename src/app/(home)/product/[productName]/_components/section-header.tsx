type SectionHeaderProps = {
  text: string
}

export const SectionHeader = ({ text }: SectionHeaderProps) => {
  return (
    <h3 className="text-accent mb-10 text-sm lg:text-base">
      <span aria-hidden="true">{`// ${text.replace(/\s+/g, '_')}`}</span>
      <span className="sr-only">{text}</span>
    </h3>
  )
}

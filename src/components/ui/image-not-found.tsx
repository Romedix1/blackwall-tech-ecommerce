export const ImageNotFound = () => {
  return (
    <div className="bg-background relative z-20 flex h-full w-full flex-col items-center justify-center">
      <span className="text-text-second text-xs">NO_DATA</span>
      <div className="bg-text-disabled my-2 h-px w-12"></div>
      <span className="text-text-second text-xs">404_IMG</span>
    </div>
  )
}

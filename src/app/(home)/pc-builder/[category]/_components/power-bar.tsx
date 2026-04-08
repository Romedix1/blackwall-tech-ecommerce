export const PowerBar = () => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        <span aria-hidden="true" className="mr-2">
          &gt;
        </span>
        Pwr: 450W / 850W
      </p>
      <div className="bg-surface relative h-1 w-full">
        <div className="bg-accent absolute h-full w-1/2"></div>
      </div>
    </div>
  )
}

type QuantityErrorProps = {
  stock: number
}

export const QuantityError = ({ stock }: QuantityErrorProps) => {
  return (
    <div className="my-6 flex flex-col gap-1">
      <p className="text-error-text text-xs font-bold tracking-widest uppercase">
        <span aria-hidden="true">[ ! ] UPLINK_ERROR: STOCK_MISMATCH</span>
        <span className="sr-only">! Uplink error: stock mismatch</span>
      </p>
      <p className="text-error-text/80 mt-2 text-xs leading-tight">
        Only <span className="text-accent font-bold">{stock}</span> units
        available. Please adjust your request
      </p>
    </div>
  )
}

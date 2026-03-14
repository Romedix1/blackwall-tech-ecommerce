import { Button } from '@/components/ui'

type AddToCartButtonProps = {
  className?: string
}

export const AddToCartButton = ({ className }: AddToCartButtonProps) => {
  return (
    <Button variant="primary" className={className}>
      <span aria-hidden="true">[ Add_to_cart ]</span>
      <span className="sr-only">Add to cart</span>
    </Button>
  )
}

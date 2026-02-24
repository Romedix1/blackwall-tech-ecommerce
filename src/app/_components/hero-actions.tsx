import { Button } from '@/components/ui'

export const HeroActions = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row lg:w-125 xl:w-155">
      <Button variant="primary" className="w-full">
        <span aria-hidden="true">[ Initialize purchase ]</span>
        <span className="sr-only">
          Initialize purchase and view product
          {/* TODO: ADD NAME */}
        </span>
      </Button>
      <Button variant="secondary" className="w-full">
        <span aria-hidden="true">[ Decode specs ]</span>
        <span className="sr-only">
          View technical specifications and hardware details
          {/* TODO: ADD NAME */}
        </span>
      </Button>
    </div>
  )
}

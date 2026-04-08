import { NavigationLinks } from '@/components/shared'
import { cn } from '@/lib'

export const BuilderNav = async () => {
  const LINKS = [
    {
      href: '/pc-builder/cpu',
      label: '[ 01 ] Processor',
      sr: 'Select Processor',
    },
    {
      href: '/pc-builder/motherboards',
      label: '[ 02 ] Motherboard',
      sr: 'Select Motherboard',
    },
    {
      href: '/pc-builder/gpu',
      label: '[ 03 ] Graphics',
      sr: 'Select Graphics Card',
    },
    {
      href: '/pc-builder/memory',
      label: '[ 04 ] Memory',
      sr: 'Select RAM',
    },
    {
      href: '/pc-builder/storage',
      label: '[ 05 ] Storage',
      sr: 'Select Storage',
    },
    {
      href: '/pc-builder/psu',
      label: '[ 06 ] Power_supply',
      sr: 'Select Power Supply',
    },
  ]

  return (
    <nav
      aria-label="Pc builder sidebar"
      className="mb-8 w-full max-w-full overflow-hidden"
    >
      <>
        <h2
          className={cn(
            'text-text-second mb-6 text-sm font-bold uppercase lg:text-base 2xl:text-xl',
          )}
        >
          <span aria-hidden="true">{'//'} The_pipeline</span>
          <span className="sr-only">The pipeline</span>
        </h2>

        <div className="relative w-full min-w-0">
          <NavigationLinks links={LINKS} />
        </div>
      </>
    </nav>
  )
}

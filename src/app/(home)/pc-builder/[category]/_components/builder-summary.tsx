import { PowerBar } from '@/app/(home)/pc-builder/[category]/_components/power-bar'
import { Button } from '@/components/ui'
import Link from 'next/link'

export const BuilderSummary = async () => {
  const SYSTEM_STATUS = {
    stable: 'SYSTEM_STABLE',
    conflict: 'SOCKET_MISMATCH',
    power_error: 'PSU_UNDERWATTAGE',
    memory_error: 'RAM_TYPE_INCOMPATIBLE',
    incomplete: 'AWAITING_CRITICAL_COMPONENTS',
    bottleneck: 'PERFORMANCE_IMBALANCE',
  }

  return (
    <>
      <h3 className="text-text-second text-sm font-bold lg:text-base 2xl:text-xl">
        <span aria-hidden="true">{'//'} System_telemetry</span>
        <span className="sr-only">System telemetry</span>
      </h3>

      <PowerBar />

      <p className="text-accent font-bold">
        <span aria-hidden="true">[ System_stable ]</span>
        <span className="sr-only">System stable</span>
      </p>

      <p>
        <span aria-hidden="true" className="mr-2">
          &gt;
        </span>
        Total: $ 0.00
      </p>

      <Button asChild className="w-full py-4 text-center">
        <Link href="/checkout">
          <span aria-hidden="true">[ Initialize_checkout ]</span>
          <span className="sr-only">Initialize checkout</span>
        </Link>
      </Button>
    </>
  )
}

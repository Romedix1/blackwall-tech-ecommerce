import { Button } from '@/components/ui'
import Link from 'next/link'

export const BuildNotPublic = () => {
  return (
    <div className="bg-surface mx-auto mt-12 flex w-11/12 flex-col gap-6 p-4 lg:max-w-[800px] lg:p-8">
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-error-text text-2xl font-bold tracking-tighter">
          <span aria-hidden="true">[ ACCESS_DENIED ]</span>
          <span className="sr-only">Access Denied</span>
        </h1>

        <p className="text-text-second text-sm lg:text-base">
          <span className="text-error-text">
            <span aria-hidden="true">&gt;</span> Status:
          </span>{' '}
          <span aria-hidden="true">Encrypted_Private_Node</span>
          <span className="sr-only">Encrypted private node</span>
        </p>
      </div>

      <div className="bg-background/50 border-error-text text-text-second w-full border p-6 text-xs leading-relaxed lg:text-sm">
        <p>
          Security protocol prevented data retrieval. This configuration has not
          been marked for <span className="text-accent">PUBLIC_BROADCAST</span>.
          Remote host credentials or owner authorization required.
        </p>
      </div>

      <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row">
        <Button
          asChild
          className="flex items-center justify-center"
          variant="secondary"
        >
          <Link href="/">
            <span aria-hidden="true">[ Back_to_Terminal ]</span>
            <span className="sr-only">Go back to home page</span>
          </Link>
        </Button>

        <Button asChild className="flex items-center justify-center">
          <Link href="/dashboard/builds">
            <span aria-hidden="true">[ My_builds ]</span>
            <span className="sr-only">Go to your dashboard</span>
          </Link>
        </Button>
      </div>

      <div
        className="text-text-disabled pointer-events-none mt-8 w-full text-[10px]"
        aria-hidden="true"
      >
        <p>Tracing_connection... failed</p>
        <p>Ip_origin: unknown</p>
        <p>Encrpytion: AES-256-BLACKWALL</p>
      </div>
    </div>
  )
}

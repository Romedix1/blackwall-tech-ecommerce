import { TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <section className="flex justify-center">
      <form className="mt-16 flex w-full flex-col border p-6 uppercase md:my-40 md:w-150 md:p-10">
        <h1 className="mb-2 font-bold md:text-2xl">
          <span aria-hidden="true">
            [ Restricted_area ] {' // '}Identification_required
          </span>
          <span className="sr-only">
            Restricted area. identification required
          </span>
        </h1>
        <p className="text-accent text-sm md:text-base">
          <span aria-hidden="true">&gt; Waiting_for_credentials</span>
          <span className="sr-only">Waiting for credentials</span>
        </p>

        <div className="my-8 flex flex-col gap-4">
          <TerminalInput
            placeholder="Operative_id (Email)"
            type="email"
            name="email"
            autoComplete="email"
            ariaLabel="Insert email"
          />
          <TerminalInput
            placeholder="Access_code: ******"
            type="password"
            name="password"
            autoComplete="current-password"
            ariaLabel="Insert password"
          />
          <Link
            href="/forgot-password"
            className="text-text-disabled hover:text-primary-hover focus:text-primary-hover self-end text-xs outline-none md:text-sm"
          >
            <span className="whitespace-nowrap" aria-hidden="true">
              [ Recover_access_key ]
            </span>
            <span className="sr-only">Forgot password? Recover access key</span>
          </Link>
        </div>

        <Button type="submit">
          <span aria-hidden="true">
            <span className="whitespace-nowrap">[ Initiate_uplink ]</span>
          </span>
          <span className="sr-only">Log in to system</span>
        </Button>

        <p className="text-text-second mt-6 text-sm sm:text-center md:mt-8">
          <span aria-hidden="true">
            &gt; No_clearance?{' '}
            <span className="whitespace-nowrap">
              <Link
                className="hover:text-primary-hover focus:text-primary-hover outline-none"
                href={'/register'}
              >
                [ Request_access ]
              </Link>
            </span>
          </span>
          <span className="sr-only">No account? request access here</span>
        </p>
      </form>
    </section>
  )
}

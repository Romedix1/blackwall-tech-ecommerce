import { TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type AuthFormProps = {
  mode: 'login' | 'register'
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const isLogin = mode === 'login'
  return (
    <section className="flex justify-center">
      <form className="mt-16 flex w-full flex-col border p-6 uppercase md:my-40 md:w-150 md:p-10">
        <h1 className="mb-2 font-bold md:text-2xl">
          <span aria-hidden="true">
            <span className="whitespace-nowrap">
              [ {isLogin ? 'Restricted_area' : 'Enlistment_protocol'} ]
            </span>{' '}
            {' // '}
            {isLogin ? 'Identification_required' : 'Create_new_record'}
          </span>
          <span className="sr-only">
            {isLogin
              ? 'Restricted area. identification required'
              : 'Create new account'}
          </span>
        </h1>
        <p className="text-accent text-sm md:text-base">
          <span aria-hidden="true">
            &gt;{' '}
            {isLogin
              ? 'Waiting_for_credentials'
              : 'Generating_new_encryption_keys...'}
          </span>
          <span className="sr-only">
            {isLogin
              ? 'Waiting for credentials'
              : 'Generating new encryption keys'}
          </span>
        </p>

        <div className="my-8 flex flex-col gap-4">
          {!isLogin && (
            <TerminalInput
              placeholder="Assign_callsign (Username)"
              type="text"
              name="username"
              autoComplete="username"
              ariaLabel="Insert username"
            />
          )}
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
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            ariaLabel="Insert password"
          />
          {isLogin && (
            <Link
              href="/forgot-password"
              className="text-text-disabled hover:text-primary-hover focus:text-primary-hover self-end text-xs outline-none md:text-sm"
            >
              <span className="whitespace-nowrap" aria-hidden="true">
                [ Recover_access_key ]
              </span>
              <span className="sr-only">
                Forgot password? Recover access key
              </span>
            </Link>
          )}
          {!isLogin && (
            <TerminalInput
              placeholder="Verify_encryption"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              ariaLabel="Confirm password"
            />
          )}
        </div>
        <Button type="submit">
          <span aria-hidden="true">
            <span className="whitespace-nowrap">
              [ {isLogin ? 'Initiate_uplink' : 'Generate_clearance'} ]
            </span>
          </span>
          <span className="sr-only">
            {isLogin ? 'Log in to system' : 'Create account'}
          </span>
        </Button>

        <p className="text-text-second mt-6 text-sm sm:text-center md:mt-8">
          <span aria-hidden="true">
            &gt; {isLogin ? 'No_clearance' : 'Already_have_clearance'}?
            <span className="whitespace-nowrap">
              <Link
                className="hover:text-primary-hover focus:text-primary-hover outline-none"
                href={isLogin ? '/register' : '/login'}
              >
                {' '}
                [ {isLogin ? 'Request_access' : 'Return_to_login'} ]
              </Link>
            </span>
          </span>
          <span className="sr-only">
            {isLogin
              ? 'No account? request access here'
              : 'Already have account? Return to login'}
          </span>
        </p>
      </form>
    </section>
  )
}

import { DashboardHeader } from '@/app/dashboard/(dashboard)/_components'
import {
  SecuritySection,
  UsernameSection,
  AddressSection,
} from '@/app/dashboard/(dashboard)/settings/_components'
import { ActiveSessions } from '@/app/dashboard/(dashboard)/settings/_components/active-sessions'
import { auth } from '@/auth'
import { Button } from '@/components/ui'
import { isOAuthUser } from '@/lib/actions/dashboard'
import { prisma } from '@/lib/prisma'

export default async function SettingsPage() {
  const isOAuth = await isOAuthUser()

  const session = await auth()
  const userId = session?.user.id

  const userAddress = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      shippingAddress: true,
      zipCode: true,
      city: true,
    },
  })

  return (
    <>
      <DashboardHeader>
        <span aria-hidden="true">{'//'} User_settings_v1</span>
        <span className="sr-only">User settings</span>
      </DashboardHeader>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <UsernameSection />

        {!isOAuth && <SecuritySection />}

        <AddressSection userAddress={userAddress} />

        <ActiveSessions />

        <section className="border-error-text/40 bg-error-bg/15 mt-10 border p-6 lg:col-span-2">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-error-text text-sm font-bold uppercase">
                <span aria-hidden="true">[ Critical_action: System_wipe ]</span>
                <span className="sr-only">Critial action: system wipe</span>
              </h2>
              <p className="text-error-text/70 mt-1 text-xs uppercase">
                Permanently delete all directives, logs, and identity records.
              </p>
            </div>
            <Button className="text-sm" variant="delete">
              <span aria-hidden="true">Initiate_Self_Destruct</span>
              <span className="sr-only">Delete account</span>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}

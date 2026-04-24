import { OtherSessionBlock } from '@/app/dashboard/(dashboard)/settings/_components/other-session-block'
import { SettingsHeader } from '@/app/dashboard/(dashboard)/settings/_components/settings-header'
import { SettingsSection } from '@/app/dashboard/(dashboard)/settings/_components/settings-section'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const ActiveSessions = async () => {
  const session = await auth()
  const userId = session?.user.id

  const currentConnectionId = session?.user.connectionId

  if (!userId) {
    redirect('/')
  }

  const activeSessionsData = await prisma.activeConnection.findMany({
    where: { userId },
    select: {
      ipAddress: true,
      browser: true,
      browserVersion: true,
      os: true,
      osVersion: true,
      country: true,
      city: true,
      sessionToken: true,
    },
  })

  const currentSession = activeSessionsData.find(
    (session) => session.sessionToken === currentConnectionId,
  )

  const otherSessions = activeSessionsData.filter(
    (session) => session.sessionToken !== currentConnectionId,
  )

  return (
    <SettingsSection>
      <SettingsHeader>
        <span aria-hidden="true">[ Active_uplinks ]</span>
        <span className="sr-only">Active uplinks</span>
      </SettingsHeader>

      <div className="border-accent bg-accent/10 border p-3 text-xs">
        <div className="mb-2 flex items-start justify-between">
          <div className="text-accent font-bold">Current_session</div>
          <div className="text-text-second">{currentSession?.ipAddress}</div>
        </div>
        <p className="uppercase">
          {currentSession?.browser} V{currentSession?.browserVersion} /{' '}
          {currentSession?.os} {currentSession?.osVersion}
        </p>
        <p className="text-text-second mt-1">
          &gt; Uplink_Location: {currentSession?.country},{' '}
          {currentSession?.city}
        </p>
      </div>

      {otherSessions.length > 0 && (
        <div className="my-3 text-sm font-bold">Other_sessions</div>
      )}

      <div className="flex flex-col gap-4">
        {otherSessions &&
          otherSessions.map((session, index) => {
            return <OtherSessionBlock session={session} key={index} />
          })}
      </div>
    </SettingsSection>
  )
}

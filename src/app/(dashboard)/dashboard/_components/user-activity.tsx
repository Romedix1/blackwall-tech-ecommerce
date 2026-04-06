import { auth } from '@/auth'
import { LogOutButton } from '@/components/shared'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const UserActivity = async () => {
  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect('/')
  }

  const userRole = user.role

  const isAdmin = userRole === 'admin'

  const userActivity = [
    {
      id: '1',
      action: 'UPLINK_ESTABLISHED',
      date: '2026-02-20',
    },
    {
      id: '2',
      action: 'PAYMENT_ACCEPTED',
      date: '2026-02-18',
    },
    { id: '3', action: 'SCHEMATIC_SAVED', date: '2026-02-18' },
  ]
  // TODO: ADD ACTIVITY TRACKER

  //   const userActivity = prisma.activity.findMany({
  //     where: { user: user.id },
  //     orderBy: {date:"desc"}
  //   })

  const getLog = (code: string) => {
    const templates: Record<string, string> = {
      UPLINK_ESTABLISHED: 'Login successful',
      PAYMENT_ACCEPTED: 'Transaction authorized',
      SCHEMATIC_SAVED: 'Hardware schematic saved',
    }

    return templates[code] || 'Unregistered system event'
  }

  return (
    <div>
      <h3 className="text-text-second mb-4 font-bold 2xl:text-xl">
        <span aria-hidden="true">{'//'} Recent_activity_logs</span>
        <span className="sr-only">Recent activity logs</span>
      </h3>
      <ul className="flex flex-col gap-3">
        {userActivity.map((activity) => {
          return (
            <li
              key={activity.id}
              className="text-text-second text-xs font-bold 2xl:text-sm"
            >
              <span aria-hidden="true">&gt; </span>
              {activity.date}: <span aria-hidden="true">{activity.action}</span>{' '}
              ({getLog(activity.action)})
            </li>
          )
        })}
      </ul>
      <div className="mt-12 lg:hidden">
        <LogOutButton isAdmin={isAdmin} className="px-0 text-sm" />
      </div>
    </div>
  )
}

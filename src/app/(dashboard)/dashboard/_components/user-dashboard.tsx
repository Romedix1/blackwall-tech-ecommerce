import { UserActivity } from '@/app/(dashboard)/dashboard/_components/user-activity'
import { auth } from '@/auth'
import { cn } from '@/lib'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const UserDashboard = async () => {
  const user = await auth()

  if (!user) {
    redirect('/')
  }

  const userOrders = await prisma.order.findMany({
    where: { userId: user.user.id },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const getStatusData = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'AWAITING_HANDSHAKE', color: 'text-blue-400' },
      paid: { label: 'CREDITS_AUTHORIZED', color: 'text-cyan-400' },
      shipped: { label: 'IN_TRANSIT', color: 'text-amber-200' },
      complete: { label: 'OPERATION_SUCCESSFUL', color: 'text-accent' },
      failed: { label: 'LINK_ABORTED', color: 'text-error-text' },
      cancelled: { label: 'SESSION_TERMINATED', color: 'text-text-second/80' },
    }

    return (
      statusMap[status] ?? {
        label: 'UNKNOWN_LOG_ENTRY',
        color: 'text-zinc-400',
      }
    )
  }

  //  @note PORTFOLIO_SIMULATION
  //  In production, ETA is fetched via a Logistics API (e.g., DHL/InPost).
  //  This is a deterministic simulation using the Order ID as a seed to
  //  ensure UI consistency across sessions without random "jumps" on refresh.

  const getETA = (createdAt: Date) => {
    const deliveryDate = new Date(createdAt)
    deliveryDate.setDate(deliveryDate.getDate() + 3)

    const now = new Date()
    const diffTime = deliveryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? `${diffDays}_DAYS` : 'ARRIVED'
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-text-second text-lg font-bold lg:text-xl 2xl:text-2xl">
        <span aria-hidden="true">{'//'} Welcome_back, </span>
        <span className="sr-only">Welcome back, </span>
        {user.user.name}
      </h1>

      <ul className="flex flex-col gap-2">
        {userOrders.map((order) => {
          const status = getStatusData(order.status)

          return (
            <li key={order.id}>
              <Link
                href={'/'}
                className="bg-surface flex flex-col gap-2.5 border p-4 lg:flex-row lg:justify-between lg:gap-10 lg:p-6"
              >
                <p className="truncate text-xs uppercase lg:text-sm 2xl:text-base">
                  <span className="mr-2" aria-hidden="true">
                    &gt;
                  </span>
                  Directive: order #{order.id}
                </p>

                <p
                  className={cn(
                    'text-xs break-all uppercase lg:text-sm 2xl:text-base',
                    status.color,
                  )}
                >
                  <span className="mr-2" aria-hidden="true">
                    &gt;
                  </span>
                  Status: {status.label}
                  (Eta: {getETA(order.createdAt)})
                </p>
              </Link>
            </li>
          )
        })}
      </ul>

      <UserActivity />
    </div>
  )
}

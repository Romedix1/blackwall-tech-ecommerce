import {
  RecordBlock,
  UserActivity,
} from '@/app/(dashboard)/dashboard/_components'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function UserDashboardPage() {
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
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  //  @note PORTFOLIO_SIMULATION
  //  In production, ETA is fetched via a Logistics API (e.g., DHL/InPost).
  //  This is a deterministic simulation using the Order ID as a seed to
  //  ensure UI consistency across sessions without random "jumps" on refresh.

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-text-second text-lg font-bold lg:text-xl 2xl:text-2xl">
        <span aria-hidden="true">{'//'} Welcome_back, </span>
        <span className="sr-only">Welcome back, </span>
        {user.user.name}
      </h1>

      {userOrders.length > 1 ? (
        <ul className="flex flex-col gap-4">
          {userOrders.map((order) => {
            return <RecordBlock key={order.id} record={order} type="order" />
          })}
        </ul>
      ) : (
        <div className="text-warning text-sm lg:text-base">
          <p className="uppercase">
            <span aria-hidden="true">[ No_orders_found_in_history ] </span>
            <span className="sr-only">No orders found in history</span>
          </p>
        </div>
      )}

      <UserActivity />
    </div>
  )
}

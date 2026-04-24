import { UserActivity } from '@/app/dashboard/(dashboard)/_components'
import { DashboardHeader } from '@/app/dashboard/(dashboard)/_components'
import { RenderRecords } from '@/app/dashboard/(dashboard)/_components/render-records'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function UserDashboardPage() {
  const user = await auth()

  if (!user) {
    redirect('/')
    return null
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
    <>
      <DashboardHeader>
        <span aria-hidden="true">{'//'} Welcome_back, </span>
        <span className="sr-only">Welcome back, </span>
        {user.user.name}
      </DashboardHeader>

      <RenderRecords type="order" records={userOrders} />
      <UserActivity />
    </>
  )
}

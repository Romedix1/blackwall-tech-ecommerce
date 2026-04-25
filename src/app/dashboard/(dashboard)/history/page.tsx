import { DashboardHeader } from '@/app/dashboard/(dashboard)/_components'
import { RenderRecords } from '@/app/dashboard/(dashboard)/_components/render-records'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function DashboardHistoryPage() {
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

  return (
    <>
      <DashboardHeader>
        <span aria-hidden="true">
          {'//'} Procurement_logs
          <span className="text-accent"> [{userOrders.length}]</span>
        </span>
        <span className="sr-only">
          Procurement logs, {userOrders.length} items found
        </span>
      </DashboardHeader>

      <RenderRecords type="order" records={userOrders} />
    </>
  )
}

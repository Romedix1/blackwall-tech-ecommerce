import {
  DashboardHeader,
  RecordBlock,
} from '@/app/dashboard/(dashboard)/_components'
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

      {userOrders.length > 1 ? (
        <ul className="flex max-h-100 flex-col gap-4 overflow-y-auto">
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
    </>
  )
}

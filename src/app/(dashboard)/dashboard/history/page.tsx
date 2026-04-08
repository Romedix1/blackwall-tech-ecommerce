import { OrderBlock } from '@/app/(dashboard)/dashboard/_components'
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
    <div>
      <ul className="flex max-h-100 flex-col gap-4 overflow-y-auto">
        {userOrders.map((order) => {
          return <OrderBlock key={order.id} order={order} />
        })}
      </ul>
    </div>
  )
}

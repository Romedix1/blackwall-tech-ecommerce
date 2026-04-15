import { RecordBlock } from '@/app/(dashboard)/dashboard/_components'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function DashboardHistoryPage() {
  const user = await auth()

  if (!user) {
    redirect('/')
  }

  const userBuilds = await prisma.build.findMany({
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
        {userBuilds.map((build) => {
          return <RecordBlock key={build.id} record={build} type="build" />
        })}
      </ul>
    </div>
  )
}

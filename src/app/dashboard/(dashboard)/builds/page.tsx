import {
  DashboardHeader,
  RecordBlock,
} from '@/app/dashboard/(dashboard)/_components'
import { RenderRecords } from '@/app/dashboard/(dashboard)/settings/_components/render-records'
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
      public: true,
      name: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <DashboardHeader>
        <span aria-hidden="true">
          {'//'} Saved_builds
          <span className="text-accent"> [{userBuilds.length}]</span>
        </span>
        <span className="sr-only">
          Saved builds, {userBuilds.length} items found
        </span>
      </DashboardHeader>

      <RenderRecords type="build" records={userBuilds} />
    </>
  )
}

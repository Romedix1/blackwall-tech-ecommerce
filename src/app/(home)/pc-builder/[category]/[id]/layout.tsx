import {
  BuilderNav,
  BuilderSummary,
  BuildInitializer,
} from '@/app/(home)/pc-builder/[category]/[id]/_components'
import { auth } from '@/auth'
import { fetchBuildFromDb } from '@/lib/actions'
import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id: buildId } = await params

  const initialItems = await fetchBuildFromDb(buildId)

  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
  }

  const build = await prisma.build.findUnique({
    where: { id: buildId, AND: { userId } },
    select: {
      name: true,
      public: true,
    },
  })

  return (
    <div className="container mx-auto mt-16 lg:flex lg:items-start lg:gap-8 lg:border lg:p-10 xl:max-w-450">
      <BuildInitializer buildId={buildId} items={initialItems} />
      <aside className="hidden min-w-0 lg:block lg:flex-2">
        <BuilderNav />
      </aside>

      <main className="min-w-0 flex-1 lg:flex-6">{children}</main>

      <aside className="mt-6 flex min-w-0 flex-col gap-6 uppercase lg:flex-3">
        <BuilderSummary
          buildName={build?.name ?? ''}
          isPublic={build?.public ?? false}
        />
      </aside>
    </div>
  )
}

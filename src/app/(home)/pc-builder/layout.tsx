import { BuilderNav } from '@/app/(home)/pc-builder/[category]/_components'
import { BuilderSummary } from '@/app/(home)/pc-builder/[category]/_components'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto mt-16 lg:flex lg:items-start lg:gap-8 lg:border lg:p-10 xl:max-w-450">
      <aside className="hidden min-w-0 lg:block lg:flex-2">
        <BuilderNav />
      </aside>

      <main className="min-w-0 flex-1 lg:flex-6">{children}</main>

      <aside className="mt-6 flex min-w-0 flex-col gap-6 uppercase lg:flex-3">
        <BuilderSummary />
      </aside>
    </div>
  )
}

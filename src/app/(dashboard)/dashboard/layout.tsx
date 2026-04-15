import { DashboardNav } from '@/app/(dashboard)/dashboard/_components'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect('/')
  }

  return (
    <div className="gap-auto container mx-auto mt-16 lg:flex lg:justify-between lg:border lg:p-10">
      <aside>
        <DashboardNav />
      </aside>

      <div className="flex flex-col gap-8 lg:w-8/12">{children}</div>
    </div>
  )
}

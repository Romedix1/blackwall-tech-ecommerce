import { DashboardNav } from '@/app/dashboard/(dashboard)/_components'
import { auth } from '@/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function OrderDetailsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/')
  }

  return (
    <div className="gap-auto container mx-auto mt-16 lg:flex lg:justify-between lg:border lg:p-10">
      <div className="lg:w-full">
        <Link
          href="/dashboard"
          className="terminal-hover group mb-8 flex w-fit items-center text-sm"
        >
          <span aria-hidden="true">
            <span className="text-accent group-hover:text-secondary">$</span> cd
            ..
            <span
              className="bg-accent/70 animate-blink ml-1 inline-block h-4 w-2"
              style={{ animationDuration: '2s' } as React.CSSProperties}
            />
          </span>
          <span className="sr-only">Return to dashboard</span>
        </Link>

        {children}
      </div>
    </div>
  )
}

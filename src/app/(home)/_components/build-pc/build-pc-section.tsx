import { BuildPcImage } from '@/app/(home)/_components/build-pc'
import { BuildPcDescription } from '@/app/(home)/_components/build-pc'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const BuildPcSection = async () => {
  const session = await auth()

  let buildsCount = 0

  if (session?.user?.id) {
    buildsCount = await prisma.build.count({
      where: { userId: session.user.id },
    })
  }

  return (
    <section className="relative container w-full items-center sm:mx-auto sm:px-4 lg:flex lg:flex-row-reverse lg:justify-between lg:border lg:p-12 2xl:p-16">
      <BuildPcImage />
      <BuildPcDescription buildsCount={buildsCount} />
    </section>
  )
}

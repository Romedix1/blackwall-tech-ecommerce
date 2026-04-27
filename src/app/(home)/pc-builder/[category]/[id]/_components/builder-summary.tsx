'use client'

import { PowerBar } from '@/app/(home)/pc-builder/[category]/[id]/_components/power-bar'
import { InformationModal, TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { useCart, useDebounce } from '@/hooks'
import { useBuilder } from '@/hooks/use-builder'
import { cn, getBuildStatus, getPowerStats, getStatusTextColor } from '@/lib'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ShareModal } from '@/app/dashboard/(dashboard)/_components'
import { WarningModal } from '@/app/(home)/pc-builder/[category]/[id]/_components/warning-modal'
import { updateBuildName } from '@/lib/actions'
import { useParams, useRouter } from 'next/navigation'

type BuilderSummaryProps = {
  buildName: string
  isPublic: boolean
}

export const BuilderSummary = ({
  buildName,
  isPublic,
}: BuilderSummaryProps) => {
  const params = useParams()
  const router = useRouter()

  const buildIdFromUrl = params?.id as string

  const { items: builderItems } = useBuilder()
  const { items: cartItems, setCart, toggle } = useCart()

  const { data: session } = useSession()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const [newName, setNewName] = useState('')

  useEffect(() => {
    if (!buildIdFromUrl) {
      router.push('/')
    }
  }, [buildIdFromUrl, router])

  const debouncedName = useDebounce(newName, 1500)

  useEffect(() => {
    if (!session || !debouncedName) return

    const syncWithDatabase = async () => {
      try {
        await updateBuildName(buildIdFromUrl, session.user.id, debouncedName)
      } catch (error) {
        console.error(' [ CHANGING_NAME_ERROR ]: ', error)
      }
    }

    syncWithDatabase()
  }, [debouncedName])

  const powerStats = getPowerStats(builderItems)

  const systemStatus = getBuildStatus(builderItems, powerStats) || {
    status: 'idle',
    message: 'Start building',
  }

  const price = builderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  const handleAdd = (alert = false) => {
    if (!alert && ['failed', 'warning'].includes(systemStatus.status)) {
      setIsModalOpen(true)
      return
    }

    const newCartItems = builderItems.map((item) => ({
      slug: item.slug,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imgSrc: item.imgSrc || null,
      stock: item.quantity,
    }))

    const mergedItems = [...cartItems]

    newCartItems.forEach((newItem) => {
      const existingIndex = mergedItems.findIndex(
        (item) => item.slug === newItem.slug,
      )
      if (existingIndex > -1) {
        mergedItems[existingIndex].quantity += newItem.quantity
      } else {
        mergedItems.push(newItem)
      }
    })

    setCart(mergedItems)
    setIsModalOpen(false)
    toggle()
  }

  if (!buildIdFromUrl) return null

  return (
    <>
      <h3 className="text-text-second text-sm font-bold lg:text-base 2xl:text-xl">
        <span aria-hidden="true">{'//'} System_telemetry</span>
        <span className="sr-only">System telemetry</span>
      </h3>

      {isModalOpen && (
        <WarningModal
          onClose={() => setIsModalOpen(false)}
          systemStatus={systemStatus}
          handleAdd={handleAdd}
        />
      )}
      {isSharing && (
        <ShareModal
          buildId={buildIdFromUrl}
          initialIsPublic={isPublic}
          onClose={() => setIsSharing(false)}
        />
      )}

      <PowerBar
        tdp={powerStats.tdp}
        maxTdp={powerStats.maxTdp}
        max={powerStats.maxWattage}
      />

      <p
        className={cn(
          'text-sm font-bold break-all lg:text-base',
          getStatusTextColor(systemStatus.status),
        )}
      >
        <span aria-hidden="true">
          [ {systemStatus.message.replaceAll(' ', '_')} ]
        </span>
        <span className="sr-only">{systemStatus.message}</span>
      </p>

      <p>
        <span aria-hidden="true" className="mr-2">
          &gt;
        </span>
        Total: $ {price.toFixed(2)}
      </p>

      <Button onClick={() => handleAdd()} className="w-full py-4 text-center">
        <span aria-hidden="true">[ add_product_to_cart ]</span>
        <span className="sr-only">Add product to cart</span>
      </Button>

      {session && (
        <div className="mt-16 flex flex-col gap-6">
          <TerminalInput
            onChange={(e) => setNewName(e.target.value)}
            value={newName && newName}
            placeholder={buildName}
            aria-label="Build name"
          />

          <Button
            onClick={() => setIsSharing(true)}
            variant="secondary"
            className="w-full py-4 text-center"
          >
            <span aria-hidden="true">[ Broadcast ]</span>
            <span className="sr-only">Share build</span>
          </Button>
        </div>
      )}
    </>
  )
}

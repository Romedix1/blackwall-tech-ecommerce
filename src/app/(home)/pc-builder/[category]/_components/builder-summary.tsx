'use client'

import { PowerBar } from '@/app/(home)/pc-builder/[category]/_components/power-bar'
import { InformationModal } from '@/components/shared'
import { Button } from '@/components/ui'
import { useCart } from '@/hooks'
import { useBuilder } from '@/hooks/use-builder'
import { cn, getBuildStatus, getPowerStats, getStatusTextColor } from '@/lib'
import { useState } from 'react'

export const BuilderSummary = () => {
  const { items: builderItems } = useBuilder()
  const { items: cartItems, setCart, toggle } = useCart()

  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const isError = systemStatus.status === 'failed'

  if (isModalOpen) {
    return (
      <InformationModal>
        <h3 className="text-sm font-bold break-all uppercase lg:text-xl">
          <span aria-hidden="true">
            [ {isError ? 'critical_build_error' : 'incomplete_configuration'} ]
          </span>
          <span className="sr-only">
            {isError ? 'Critical build error' : 'Incomplete configuration'}
          </span>
        </h3>

        <div className="my-6 space-y-2 font-mono text-sm">
          <p className={cn(isError ? 'text-error-text' : 'text-warning')}>
            <span aria-hidden="true">&gt; status: {systemStatus.status}</span>
            <span className="sr-only">Status: {systemStatus.status}</span>
          </p>
          <p className="text-text-second">
            <span aria-hidden="true">
              &gt; detected_issue: {systemStatus.message.replaceAll(' ', '_')}
            </span>
            <span className="sr-only">
              Detected issue: {systemStatus.message}
            </span>
          </p>
          <p className="mt-4 border-t pt-4 text-xs break-all">
            <span aria-hidden="true">
              {isError
                ? '!! alert: adding_incompatible_hardware_may_result_in_system_failure'
                : '?? notice: proceeding_with_incomplete_system_configuration'}
            </span>
            <span className="sr-only">
              {isError
                ? 'Alert: adding incompatible hardware may result in system failure'
                : 'Notice: proceeding with incomplete system configuration'}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <Button
            onClick={() => handleAdd(true)}
            className="w-full py-4 text-center"
          >
            <span aria-hidden="true">
              [ {isError ? 'force_add_broken_build' : 'add_incomplete_build'} ]
            </span>
            <span className="sr-only">
              {isError ? 'Force add broken build' : 'Add incomplete build'}
            </span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
            className="w-full py-4 text-center"
          >
            <span aria-hidden="true">
              [ {isError ? 'return_to_telemetry' : 'cancel_action'} ]
            </span>
            <span className="sr-only">
              {isError ? 'Return to telemetry' : 'Cancel action'}
            </span>
          </Button>
        </div>
      </InformationModal>
    )
  }

  return (
    <>
      <h3 className="text-text-second text-sm font-bold lg:text-base 2xl:text-xl">
        <span aria-hidden="true">{'//'} System_telemetry</span>
        <span className="sr-only">System telemetry</span>
      </h3>

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
    </>
  )
}

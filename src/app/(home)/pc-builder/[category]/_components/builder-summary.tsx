'use client'

import { PowerBar } from '@/app/(home)/pc-builder/[category]/_components/power-bar'
import { InformationModal } from '@/components/shared'
import { Button } from '@/components/ui'
import { useCart } from '@/hooks'
import { useBuilder } from '@/hooks/use-builder'
import { cn } from '@/lib'
import { useState } from 'react'

type PSUItem = {
  technicial?: {
    wattage?: number
  }
}

type BuilderItem = {
  technical?: {
    socket?: string
    tdp?: number
    maxTdp?: number
    wattage?: number
    ramGen?: string
    ramSlots?: number
    maxRamCapacity?: number
    m2Slots?: number
    capacity?: number
  }
  technicial?: {
    socket?: string
    wattage?: number
  }
  category: string
  quantity: number
}

export const BuilderSummary = () => {
  const SYSTEM_STATUS = {
    stable: 'system stable',
    conflict: 'socket mismatch',
    power_error: 'psu underwattage',
    max_power_error: 'max power exceeded',
    memory_error: 'ram type incompatible',
    incomplete: 'awaiting critical components',
    bottleneck: 'performance imbalance',
    too_many_cpus: 'excessive cpu count',
    too_many_mobos: 'multiple motherboards detected',
    too_many_psus: 'too many power supplies',
    too_many_ram: 'too many ram sticks',
    too_many_storage: 'exceeds storage slots',
  }

  const { items: builderItems } = useBuilder()
  const { items: cartItems, setCart, toggle } = useCart()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const powerStats = builderItems.reduce(
    (acc, item) => {
      const tech = item.technical || (item as PSUItem).technicial
      const category = item.category

      if (category === 'psu') {
        const wattage = Number(tech?.wattage || 0)
        acc.maxWattage += wattage * item.quantity
      }

      if (['cpu', 'gpu'].includes(category)) {
        const base = Number(tech?.tdp || 0) * item.quantity
        const peak = Number(tech?.maxTdp || base || 0) * item.quantity

        acc.tdp += base
        acc.maxTdp += peak
      }

      if (item.category === 'motherboards') {
        acc.tdp += 50 * item.quantity
        acc.maxTdp += 50 * item.quantity
      }

      if (item.category === 'storage') {
        acc.tdp += 10 * item.quantity
        acc.maxTdp += 10 * item.quantity
      }

      if (item.category === 'memory') {
        acc.tdp += 5 * item.quantity
        acc.maxTdp += 5 * item.quantity
      }

      return acc
    },
    { tdp: 0, maxTdp: 0, maxWattage: 0 },
  )

  const getStatus = () => {
    const counts = builderItems.reduce(
      (acc, item) => {
        const category = item.category.toLowerCase()
        acc[category] = (acc[category] || 0) + item.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    const cpu = builderItems.find(
      (item) => item.category === 'cpu',
    ) as BuilderItem
    const mobo = builderItems.find(
      (item) => item.category === 'motherboards',
    ) as BuilderItem
    const psu = builderItems.find(
      (item) => item.category === 'psu',
    ) as BuilderItem
    const ramItems = builderItems.filter((item) => item.category === 'memory')

    if ((counts['cpu'] || 0) > 1)
      return { status: 'failed', message: SYSTEM_STATUS.too_many_cpus }
    if ((counts['motherboards'] || 0) > 1)
      return { status: 'failed', message: SYSTEM_STATUS.too_many_mobos }
    if ((counts['psu'] || 0) > 1)
      return { status: 'failed', message: SYSTEM_STATUS.too_many_psus }

    if (cpu && mobo) {
      const cpuSocket =
        cpu.technical?.socket || (cpu as BuilderItem).technicial?.socket
      const moboSocket =
        mobo.technical?.socket || (mobo as BuilderItem).technicial?.socket

      if (
        cpuSocket &&
        moboSocket &&
        cpuSocket.toLowerCase() !== moboSocket.toLowerCase()
      ) {
        return { status: 'failed', message: SYSTEM_STATUS.conflict }
      }
    }

    if (mobo && ramItems.length > 0) {
      const moboRamGen = mobo.technical?.ramGen?.toLowerCase()

      for (const ram of ramItems) {
        const ramGen = ram.technical?.ramGen?.toLowerCase()
        if (moboRamGen && ramGen && moboRamGen !== ramGen) {
          return { status: 'failed', message: SYSTEM_STATUS.memory_error }
        }
      }
    }

    if (mobo) {
      const availableRamSlots = Number(mobo.technical?.ramSlots || 4)
      if ((counts['memory'] || 0) > availableRamSlots) {
        return {
          status: 'failed',
          message: `${SYSTEM_STATUS.too_many_ram} Max: ${availableRamSlots}`,
        }
      }

      const totalRamGB = ramItems.reduce((acc, i) => {
        const capacity = Number(i.technical?.capacity || 0)
        return acc + capacity * i.quantity
      }, 0)
      const maxMoboCap = Number(mobo.technical?.maxRamCapacity || 128)

      if (totalRamGB > maxMoboCap) {
        return {
          status: 'failed',
          message: `EXCEEDS_MAX_RAM_CAPACITY (${maxMoboCap}GB)`,
        }
      }

      const m2Limit = Number(mobo.technical?.m2Slots || 2)
      if ((counts['storage'] || 0) > m2Limit) {
        return {
          status: 'failed',
          message: `${SYSTEM_STATUS.too_many_storage} Limit: ${m2Limit}`,
        }
      }
    }

    if (psu && powerStats.tdp > powerStats.maxWattage) {
      return { status: 'failed', message: SYSTEM_STATUS.power_error }
    } else if (psu && powerStats.maxTdp > powerStats.maxWattage) {
      return { status: 'failed', message: SYSTEM_STATUS.max_power_error }
    }

    const required = ['cpu', 'motherboards', 'memory', 'psu']
    const currentCategories = builderItems.map((item) =>
      item.category.toLowerCase(),
    )
    const isComplete = required.every((cat) => currentCategories.includes(cat))

    if (!isComplete) {
      return { status: 'warning', message: SYSTEM_STATUS.incomplete }
    }

    return { status: 'success', message: SYSTEM_STATUS.stable }
  }

  const systemStatus = getStatus() || {
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
          systemStatus.status === 'failed'
            ? 'text-error-text'
            : systemStatus.status === 'warning'
              ? 'text-warning'
              : systemStatus.status === 'idle'
                ? 'text-indigo-600'
                : 'text-accent',
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

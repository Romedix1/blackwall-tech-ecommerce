import { BuilderItem } from '@/types'

export const getPowerStats = (builderItems: BuilderItem[]) => {
  return builderItems.reduce(
    (acc, item) => {
      const tech = item.technical
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
}

export type BuildStatus = {
  status: 'failed' | 'warning' | 'success' | 'idle'
  message: string
}

export const getBuildStatus = (
  builderItems: BuilderItem[],
  powerStats: { tdp: number; maxTdp: number; maxWattage: number },
) => {
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
      cpu.technical?.socket || (cpu as BuilderItem).technical?.socket
    const moboSocket =
      mobo.technical?.socket || (mobo as BuilderItem).technical?.socket

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

export const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'failed':
      return 'text-error-text'
    case 'warning':
      return 'text-warning'
    case 'idle':
      return 'text-blue-400'
    default:
      return 'text-accent'
  }
}

export const generateBuildName = () => {
  const prefixes = [
    'ALPHA',
    'VOID',
    'PHANTOM',
    'NEON',
    'CORE',
    'GHOST',
    'ZENITH',
  ]
  const suffixes = ['STRIKE', 'PROTOCOL', 'ZERO', 'LINK', 'DRIVE', 'GRID']
  const hex = Math.floor(Math.random() * 0xfff)
    .toString(16)
    .toUpperCase()
    .padStart(3, '0')

  const p = prefixes[Math.floor(Math.random() * prefixes.length)]
  const s = suffixes[Math.floor(Math.random() * suffixes.length)]

  return `${p}_${s}-${hex}`
}

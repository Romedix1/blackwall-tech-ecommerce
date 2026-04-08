import { getGraphicsCards } from './graphics-cards'
import { getMemory } from './memory'
import { getMotherboards } from './motherboards'
import { getPeripherals } from './peripherals'
import { getPowerSupplies } from './power-supplies'
import { getProcessors } from './processors'

export const getAllProducts = (categoryIds: Record<string, string>) => [
  ...getGraphicsCards(categoryIds),
  ...getProcessors(categoryIds),
  ...getMemory(categoryIds),
  ...getPeripherals(categoryIds),
  ...getPowerSupplies(categoryIds),
  ...getMotherboards(categoryIds),
]

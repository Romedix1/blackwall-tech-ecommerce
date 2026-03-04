import { getGraphicsCards } from './graphics-cards'

export const getAllProducts = (categoryIds: Record<string, string>) => [
  ...getGraphicsCards(categoryIds),
]

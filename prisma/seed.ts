import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma'
import { categories } from './data/categories'
import { getAllProducts } from './data/products/get-all-products'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seedCategories() {
  const categoryMap: Record<string, string> = {}

  for (const category of categories) {
    const upserted = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: {
        name: category.name,
        slug: category.slug,
      },
    })
    categoryMap[category.slug] = upserted.id
  }

  return categoryMap
}

async function seedProducts(categoryIds: Record<string, string>) {
  const products = getAllProducts(categoryIds)

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }
}

async function main() {
  try {
    const ids = await seedCategories()
    await seedProducts(ids)
  } catch (e) {
    process.exit(1)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })

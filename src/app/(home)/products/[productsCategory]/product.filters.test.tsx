import { mapUrlParamsToPrismaFilters } from '@/lib'
import { describe, it, expect } from 'vitest'

describe('mapUrlParamsToPrismaFilters', () => {
  it('should map valid search params to Prisma JSONB filters', () => {
    const input = { socket: 'LGA1700', brand: 'intel' }
    const result = mapUrlParamsToPrismaFilters(input)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      specification: {
        array_contains: [{ attributes: [{ key: 'socket', value: 'LGA1700' }] }],
      },
    })
  })

  it('should exclude the "search" key from Prisma filters', () => {
    const input = { search: 'i9-14900k', socket: 'LGA1700' }
    const result = mapUrlParamsToPrismaFilters(input)

    expect(result).toHaveLength(1)
    expect(result[0].specification.array_contains[0].attributes[0].key).toBe(
      'socket',
    )
  })

  it('should filter out empty strings and undefined values', () => {
    const input = {
      socket: 'AM5',
      brand: '',
      color: undefined,
    }
    const result = mapUrlParamsToPrismaFilters(input)

    expect(result).toHaveLength(1)
    expect(result[0].specification.array_contains[0].attributes[0].key).toBe(
      'socket',
    )
  })

  it('should return an empty array when no valid attributes are provided', () => {
    const result = mapUrlParamsToPrismaFilters({ search: 'something' })
    expect(result).toEqual([])
  })
})

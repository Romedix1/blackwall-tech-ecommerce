'use client'

import { useBuilder } from '@/hooks'
import { useEffect } from 'react'

type BuilderItem = {
  slug: string
  name: string
  price: number
  quantity: number
  imgSrc: string | null
  stock?: number
  category: string
  technical: Record<string, string>
}

type BuildInitializerProps = {
  buildId: string
  items: BuilderItem[]
}

export const BuildInitializer = ({ buildId, items }: BuildInitializerProps) => {
  const { setBuildId, setItems } = useBuilder()

  useEffect(() => {
    setBuildId(buildId)

    setItems(items)
  }, [buildId, items, setBuildId, setItems])

  return null
}

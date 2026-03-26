'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function StatusWatcher({ orderId }: { orderId: string }) {
  const router = useRouter()

  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (attempts > 225) {
      return
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`)
        if (!res.ok) return

        const data = await res.json()
        setAttempts((prev) => prev + 1)

        if (data.status === 'paid' || data.status === 'failed') {
          router.refresh()
          clearInterval(interval)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[STATUS_CHECK_ERROR]: ', error)
        }
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [orderId, router, attempts])

  return null
}

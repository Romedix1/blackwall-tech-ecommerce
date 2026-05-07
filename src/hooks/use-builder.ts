import { getBuildStatus, getPowerStats } from '@/lib'
import { saveBuildToDb } from '@/lib/actions'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

type BuilderStore = {
  items: BuilderItem[]
  buildId: string | null
  setBuildId: (id: string) => void
  addItem: (item: BuilderItem, isLoggedIn?: boolean) => Promise<void>
  removeItem: (slug: string, isLoggedIn?: boolean) => Promise<void>
  updateQuantity: (
    slug: string,
    quantity: number,
    isLoggedIn?: boolean,
  ) => Promise<void>
  setItems: (items: BuilderItem[]) => void
}

let timeoutId: ReturnType<typeof setTimeout>

const debouncedSaveToDb = (
  items: BuilderItem[],
  status: string,
  buildId: string | null,
) => {
  if (!buildId) return

  clearTimeout(timeoutId)

  timeoutId = setTimeout(async () => {
    try {
      const itemsToSave = items.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
      }))

      await saveBuildToDb(
        {
          items: itemsToSave,
          status,
        },
        buildId,
      )
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ BUILD_SYNC_ERROR ]: ', error)
      }
    }
  }, 1000)
}

export const useBuilder = create<BuilderStore>()(
  persist(
    (set, get) => {
      const refreshAndSync = (newItems: BuilderItem[], isLoggedIn: boolean) => {
        set({ items: newItems })

        const powerStats = getPowerStats(newItems)
        const statusResult = getBuildStatus(newItems, powerStats)
        const currentStatus = statusResult.status || 'idle'

        if (isLoggedIn) {
          debouncedSaveToDb(newItems, currentStatus, get().buildId)
        }
      }
      return {
        items: [] as BuilderItem[],
        buildId: null,
        setBuildId: (id) => {
          const currentId = get().buildId

          if (id !== currentId) {
            set({ buildId: id, items: [] })
          } else {
            set({ buildId: id })
          }
        },

        setItems: (items) => set({ items }),
        addItem: async (item, isLoggedIn = false) => {
          const currentItems = get().items
          if (currentItems.find((i) => i.slug === item.slug)) return

          const newItems = [...currentItems, item]
          refreshAndSync(newItems, isLoggedIn)
        },

        removeItem: async (slug, isLoggedIn = false) => {
          const newItems = get().items.filter((item) => item.slug !== slug)
          refreshAndSync(newItems, isLoggedIn)
        },

        updateQuantity: async (slug, quantity, isLoggedIn = false) => {
          const newItems = get().items.map((item) =>
            item.slug === slug
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          )

          refreshAndSync(newItems, isLoggedIn)
        },
      }
    },
    {
      name: 'build-storage',
      partialize: (state) => ({ items: state.items, buildId: state.buildId }),
    },
  ),
)

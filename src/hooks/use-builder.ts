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
  addItem: (
    slug: string,
    name: string,
    price: number,
    quantity: number,
    imgSrc: string | null,
    category: string,
    technical: Record<string, string>,
    stock?: number,
    isLoggedIn?: boolean,
  ) => Promise<void>
  removeItem: (slug: string, isLoggedIn?: boolean) => Promise<void>
  updateQuantity: (
    slug: string,
    quantity: number,
    isLoggedIn?: boolean,
  ) => Promise<void>
  setItems: (items: BuilderItem[]) => void
}

let timeoutId: ReturnType<typeof setTimeout>

const debouncedSaveToDb = (items: BuilderItem[]) => {
  clearTimeout(timeoutId)

  timeoutId = setTimeout(async () => {
    try {
      const itemsToSave = items.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
      }))
      await saveBuildToDb(itemsToSave)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ BUILD_SYNC_ERROR ]: ', error)
      }
    }
  }, 1000)
}

export const useBuilder = create<BuilderStore>()(
  persist(
    (set, get) => ({
      items: [] as BuilderItem[],
      setItems: (items) => set({ items }),
      addItem: async (
        slug,
        name,
        price,
        quantity,
        imgSrc,
        category,
        technical,
        stock,
        isLoggedIn = false,
      ) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.slug === slug)

        if (existingItem) {
          return
        } else {
          set({
            items: [
              ...currentItems,
              {
                slug,
                name,
                price,
                quantity,
                stock,
                imgSrc,
                technical,
                category,
              },
            ],
          })
        }

        if (isLoggedIn) debouncedSaveToDb(get().items)
      },

      removeItem: async (slug, isLoggedIn = false) => {
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        }))

        if (isLoggedIn) debouncedSaveToDb(get().items)
      },

      updateQuantity: async (slug, quantity, isLoggedIn = false) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.slug === slug
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        }))

        if (isLoggedIn) debouncedSaveToDb(get().items)
      },
    }),
    {
      name: 'build',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

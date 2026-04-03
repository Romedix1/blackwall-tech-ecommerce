import { fetchProductsStock, saveCartInDb } from '@/lib/actions/cart'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = {
  slug: string
  name: string
  price: number
  quantity: number
  imgSrc: string
  stock?: number
}

type CartStore = {
  lastChecked: number
  items: CartItem[]
  isOpen: boolean
  toggle: () => Promise<void>
  addItem: (
    slug: string,
    name: string,
    price: number,
    quantity: number,
    imgSrc: string,
    stock?: number,
    isLoggedIn?: boolean,
  ) => Promise<void>
  updateQuantity: (
    slug: string,
    quantity: number,
    isLoggedIn?: boolean,
  ) => Promise<void>
  removeItem: (slug: string, isLoggedIn?: boolean) => Promise<void>
  setCart: (items: CartItem[]) => void
}

let timeoutId: ReturnType<typeof setTimeout>

const debouncedSaveToDb = (items: CartItem[]) => {
  clearTimeout(timeoutId)

  timeoutId = setTimeout(async () => {
    try {
      const itemsToSave = items.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
      }))
      await saveCartInDb(itemsToSave)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[ CART_SYNC_ERROR ]: ', error)
      }
    }
  }, 1000)
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [] as CartItem[],
      isOpen: false,
      lastChecked: 0,
      toggle: async () => {
        const state = get()
        const nextOpenState = !state.isOpen
        const currentTime = Date.now()
        const COOLDOWN = 20000

        set(() => ({
          isOpen: nextOpenState,
        }))

        if (
          nextOpenState &&
          currentTime - state.lastChecked > COOLDOWN &&
          state.items.length > 0
        ) {
          try {
            const slugs = state.items.map((item) => item.slug)

            set({ lastChecked: currentTime })

            const dbStock = await fetchProductsStock(slugs)

            const updatedItems = get().items.map((item) => {
              const dbInfo = dbStock.find((s) => s.slug === item.slug)
              return dbInfo ? { ...item, stock: dbInfo.quantity } : item
            })

            set({ items: updatedItems, lastChecked: currentTime })
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[ STOCK_FETCH_ERROR ]: ', error)
            }
          }
        }
      },
      setCart: (items) => set({ items }),
      addItem: async (
        slug,
        name,
        price,
        quantity,
        imgSrc,
        stock,
        isLoggedIn = false,
      ) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.slug === slug)

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.slug === slug
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    stock: stock ?? item.stock,
                  }
                : item,
            ),
          })
        } else {
          set({
            items: [
              ...currentItems,
              { slug, name, price, quantity, stock, imgSrc },
            ],
          })
        }

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

      removeItem: async (slug, isLoggedIn = false) => {
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        }))

        if (isLoggedIn) debouncedSaveToDb(get().items)
      },
    }),
    {
      name: 'cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

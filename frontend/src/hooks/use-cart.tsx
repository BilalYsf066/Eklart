import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from "sonner"
import { api, getAuthToken } from '@/lib/api'

export interface CartItem {
  id: number
  title: string
  price: number
  imageUrl: string
  quantity: number
  artisan: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity' | 'artisan'> & { artisan: string }, quantity?: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  fetchCart: () => Promise<void>
  mergeLocalCart: () => Promise<void>
  _clearLocalCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (itemData, quantity = 1) => {
        const token = getAuthToken()
        toast.success(`${itemData.title} ajouté au panier`)

        if (token) {
          try {
            await api.post('/cart', { article_id: itemData.id, quantity })
            await get().fetchCart()
          } catch (error) {
            toast.error("Erreur de synchronisation du panier")
          }
        } else {
          const currentItems = get().items
          const existingItem = currentItems.find((i) => i.id === itemData.id)
          if (existingItem) {
            set({
              items: currentItems.map((i) =>
                i.id === itemData.id ? { ...i, quantity: i.quantity + quantity } : i
              )
            })
          } else {
            set({ items: [...currentItems, { ...itemData, quantity }] })
          }
        }
      },

      removeItem: async (id) => {
        const token = getAuthToken()
        const itemToRemove = get().items.find(item => item.id === id)

        set({ items: get().items.filter((item) => item.id !== id) })
        if (itemToRemove) toast.info(`${itemToRemove.title} retiré du panier`)

        if (token) {
          try {
            await api.delete(`/cart/${id}`)
          } catch (error) {
            toast.error("Erreur de synchronisation du panier")
            get().fetchCart() // Re-fetch to revert optimistic update
          }
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        const token = getAuthToken()
        
        set({ items: get().items.map((item) => item.id === id ? { ...item, quantity } : item) })

        if (token) {
          try {
            await api.put(`/cart/${id}`, { quantity })
          } catch (error) {
            toast.error("Erreur de synchronisation du panier")
            get().fetchCart() // Re-fetch to revert optimistic update
          }
        }
      },

      clearCart: async () => {
        const token = getAuthToken()
        if (token) {
          try {
            await api.delete('/cart/clear')
          } catch (error) {
            toast.error("Erreur de synchronisation du panier")
          }
        }
        set({ items: [] })
        toast.info("Panier vidé")
      },
      
      _clearLocalCart: () => {
          set({items: []})
      },

      fetchCart: async () => {
        const token = getAuthToken()
        if (!token) return
        try {
          const response = await api.get('/cart')
          set({ items: response.data })
        } catch (error) {
          console.error("Failed to fetch cart:", error)
        }
      },

      mergeLocalCart: async () => {
        const token = getAuthToken()
        const localItems = get().items
        if (!token || localItems.length === 0) {
          if(token) await get().fetchCart()
          return
        }

        try {
          const response = await api.post('/cart/merge', { items: localItems })
          set({ items: response.data })
        } catch (error) {
          console.error("Failed to merge cart:", error)
          await get().fetchCart()
        }
      }
    }),
    {
      name: "eklart-cart",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const token = getAuthToken()
          if (token) {
            // If user is authenticated on load, we prioritize server cart.
            // We'll merge the persisted local cart right after authentication check.
            state._clearLocalCart()
          }
        }
      }
    }
  )
)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  artisan: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        
        if (existingItem) {
          // Increment quantity if item already exists
          return set({
            items: currentItems.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          });
        }
        
        // Add new item with quantity 1
        set({ items: [...currentItems, { ...item, quantity: 1 }] });
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id)
        });
      },
      
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((item) => 
            item.id === id ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      }
    }),
    {
      name: "eklart-cart"
    }
  )
);
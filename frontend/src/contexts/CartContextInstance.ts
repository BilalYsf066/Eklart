import { createContext } from 'react';
import type { CartContextType } from './CartContext';

export const CartContext = createContext<CartContextType | undefined>(undefined);

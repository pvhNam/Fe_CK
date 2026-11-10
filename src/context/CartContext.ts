import {createContext} from 'react'
import type {CartItem, CartProduct, CartTotals} from '../types'

export type CartContextValue = {
    items: readonly Readonly<CartItem>[]
    itemCount: number
    storageError: string | null
    addItem: (product: CartProduct, quantity?: number) => void
    setQuantity: (product: CartProduct, quantity: number) => void
    increaseQuantity: (product: CartProduct) => void
    decreaseQuantity: (product: CartProduct) => void
    removeItem: (productId: number) => void
    clearCart: () => void
    getTotals: (products: readonly CartProduct[], shippingFee?: number) => CartTotals
    clearStorageError: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)
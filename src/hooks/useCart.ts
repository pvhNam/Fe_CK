import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export function useCart() {
    const cart = useContext(CartContext)
    if (cart === undefined) throw new Error('useCart phải được sử dụng bên trong CartProvider')
    return cart
}
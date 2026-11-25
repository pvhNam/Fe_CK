import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {ReactNode} from 'react'
import type {CartItem, CartProduct} from '../types'
import {calculateCartTotals} from '../utils/cart'
import {addCartItem, removeCartItem, setCartItemQuantity} from '../utils/cartState'
import {CART_STORAGE_KEY, readStoredCart, writeStoredCart} from '../utils/cartStorage'
import {CartContext} from './CartContext'
import type {CartContextValue} from './CartContext'

export default function CartProvider({children}: { children: ReactNode }) {
    const [initial] = useState(readStoredCart)
    const [items, setItems] = useState(initial.items)
    const [storageError, setStorageError] = useState(initial.error)
    const currentItems = useRef(initial.items)

    useEffect(() => {
        function refreshCart() {
            const stored = readStoredCart()
            currentItems.current = stored.items
            setItems(stored.items)
            setStorageError(stored.error)
        }
        function onStorage(event: StorageEvent) {
            if (event.storageArea === window.localStorage && (event.key === CART_STORAGE_KEY || event.key === null)) refreshCart()
        }
        function onPageShow(event: PageTransitionEvent) {
            if (event.persisted) refreshCart()
        }
        window.addEventListener('storage', onStorage)
        window.addEventListener('pageshow', onPageShow)
        return () => {
            window.removeEventListener('storage', onStorage)
            window.removeEventListener('pageshow', onPageShow)
        }
    }, [])

    const commit = useCallback((next: CartItem[]) => {
        try {
            writeStoredCart(next)
        } catch (error) {
            setStorageError(error instanceof Error ? error.message : 'Không lưu được giỏ hàng')
            throw error
        }
        currentItems.current = next
        setItems(next)
        setStorageError(null)
    }, [])

    const addItem = useCallback((product: CartProduct, quantity = 1) => {
        commit(addCartItem(currentItems.current, product, quantity))
    }, [commit])

    const setQuantity = useCallback((product: CartProduct, quantity: number) => {
        commit(setCartItemQuantity(currentItems.current, product, quantity))
    }, [commit])

    const increaseQuantity = useCallback((product: CartProduct) => {
        const item = currentItems.current.find(item => item.productId === product.id)
        if (!item) throw new Error('Sản phẩm chưa có trong giỏ hàng')
        setQuantity(product, item.quantity + 1)
    }, [setQuantity])

    const decreaseQuantity = useCallback((product: CartProduct) => {
        const item = currentItems.current.find(item => item.productId === product.id)
        if (!item) throw new Error('Sản phẩm chưa có trong giỏ hàng')
        if (item.quantity > 1) setQuantity(product, item.quantity - 1)
    }, [setQuantity])

    const removeItem = useCallback((productId: number) => {
        commit(removeCartItem(currentItems.current, productId))
    }, [commit])

    const clearCart = useCallback((purchased?: readonly CartItem[]) => {
        if (!purchased) return commit([])
        // Một tab khác có thể thêm cây trong lúc checkout đang chờ API.
        const stored = readStoredCart()
        if (stored.error) throw new Error(stored.error)
        const bought = new Map(purchased.map(item => [item.productId, item.quantity]))
        const remaining = stored.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity - (bought.get(item.productId) ?? 0),
        })).filter(item => item.quantity > 0)
        commit(remaining)
    }, [commit])
    const clearStorageError = useCallback(() => setStorageError(null), [])
    const getTotals = useCallback((products: readonly CartProduct[], shippingFee = 0) => {
        return calculateCartTotals(currentItems.current, products, shippingFee)
    }, [])

    const value = useMemo<CartContextValue>(() => ({
        items, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), storageError,
        addItem, setQuantity, increaseQuantity, decreaseQuantity, removeItem, clearCart,
        getTotals, clearStorageError,
    }), [items, storageError, addItem, setQuantity, increaseQuantity, decreaseQuantity,
        removeItem, clearCart, getTotals, clearStorageError])

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
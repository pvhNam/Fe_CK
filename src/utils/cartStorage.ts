import type { CartItem } from '../types'
import { normalizeCart } from './cartState.ts'

export const CART_STORAGE_KEY = 'mam-xanh.cart.v1'
type CartStorage = Pick<Storage, 'getItem' | 'setItem'>

export function readStoredCart(storage?: CartStorage): { items: CartItem[]; error: string | null } {
    if (!storage && typeof window === 'undefined') return { items: [], error: null }
    try {
        const raw = (storage ?? window.localStorage).getItem(CART_STORAGE_KEY)
        return { items: raw === null ? [] : normalizeCart(JSON.parse(raw)), error: null }
    } catch {
        return { items: [], error: 'Không đọc được giỏ đã lưu' }
    }
}

export function writeStoredCart(items: readonly CartItem[], storage?: CartStorage): void {
    const normalized = normalizeCart(items)
    try {
        (storage ?? window.localStorage).setItem(CART_STORAGE_KEY, JSON.stringify(normalized))
    } catch {
        throw new Error('Không lưu được giỏ hàng')
    }
}
import type { CartItem, CartProduct } from '../types'
import { calculateItemTotal, validateCartQuantity } from './cart.ts'

function validateProductId(productId: number): void {
    if (!Number.isSafeInteger(productId) || productId <= 0) {
        throw new RangeError('Mã sản phẩm phải là số nguyên dương')
    }
}

/** Kiểm tra dữ liệu lưu và gộp các dòng trùng*/
export function normalizeCart(value: unknown): CartItem[] {
    if (!Array.isArray(value)) throw new TypeError('Phải là một danh sách')
    const quantities = new Map<number, number>()
    let itemCount = 0
    for (const item of value) {
        if (!item || typeof item !== 'object') throw new TypeError('Sản phẩm trong giỏ không hợp lệ')
        validateProductId(item.productId)
        validateCartQuantity(item.quantity, Number.MAX_SAFE_INTEGER)
        const quantity = (quantities.get(item.productId) ?? 0) + item.quantity
        validateCartQuantity(quantity, Number.MAX_SAFE_INTEGER)
        itemCount += item.quantity
        if (!Number.isSafeInteger(itemCount)) throw new RangeError('Tổng số lượng trong giỏ quá lớn')
        quantities.set(item.productId, quantity)
    }
    return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }))
}

export function addCartItem(
    cart: readonly CartItem[], product: CartProduct, quantity = 1,
    ): CartItem[] {
    validateProductId(product.id)
    validateCartQuantity(quantity, product.stock)
    const next = normalizeCart(cart)
    const existing = next.find(item => item.productId === product.id)
    const totalQuantity = (existing?.quantity ?? 0) + quantity
    calculateItemTotal(product, totalQuantity)
    if (existing)
        existing.quantity = totalQuantity
    else
        next.push({ productId: product.id, quantity: totalQuantity })
    return normalizeCart(next)
}

export function setCartItemQuantity(
    cart: readonly CartItem[], product: CartProduct, quantity: number,
): CartItem[] {
    validateProductId(product.id)
    calculateItemTotal(product, quantity)
    const next = normalizeCart(cart)
    const existing = next.find(item => item.productId === product.id)
    if (!existing) throw new Error('Sản phẩm chưa có trong giỏ hàng')
    existing.quantity = quantity
    return normalizeCart(next)
}

export function removeCartItem(cart: readonly CartItem[], productId: number): CartItem[] {
    validateProductId(productId)
    return normalizeCart(cart).filter(item => item.productId !== productId)
}
import type {Coupon} from '../types'

export function couponDiscount(coupon: Coupon, subtotal: number, now = Date.now()): number {
    if (now > Date.parse(coupon.expiresAt) || subtotal < coupon.minSubtotal) return 0
    return Math.min(coupon.amount, subtotal)
}
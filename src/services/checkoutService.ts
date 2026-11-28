import type { Coupon, PaymentMethod, ShippingMethod } from '../types'
import { getJson } from './api'
import type { ApiResult } from './api'

export async function getCoupons(): Promise<ApiResult<Coupon[]>> {
    const result = await getJson<Coupon[]>('/coupons')
    if (!result.ok) return result
    if (!Array.isArray(result.data) || result.data.some(c => !c || typeof c.code !== 'string' || !c.code.trim()
        || !Number.isSafeInteger(c.amount) || c.amount <= 0 || !Number.isSafeInteger(c.minSubtotal)
        || c.minSubtotal < 0 || !Number.isFinite(Date.parse(c.expiresAt)))) {
        return {ok: false, status: 200, message: 'Dữ liệu mã giảm giá không hợp lệ.'}
    }
    return result
}

export async function getShippingMethods(): Promise<ApiResult<ShippingMethod[]>> {
    const result = await getJson<ShippingMethod[]>('/shippingMethods')
    if (!result.ok) return result

    const ids = new Set<number>()
    const invalid = !Array.isArray(result.data) || result.data.some(method => {
        if (!method || typeof method !== 'object'
            || !Number.isSafeInteger(method.id) || method.id <= 0 || ids.has(method.id)
            || typeof method.name !== 'string' || !method.name.trim()
            || !Number.isSafeInteger(method.fee) || method.fee < 0
            || typeof method.estimatedDays !== 'string' || !method.estimatedDays.trim()) {
            return true
        }
        ids.add(method.id)
        return false
    })

    return invalid
        ? {ok: false, status: 200, message: 'Dữ liệu phương thức giao hàng không hợp lệ.'}
        : result
}

export async function getPaymentMethods(): Promise<ApiResult<PaymentMethod[]>> {
    const result = await getJson<PaymentMethod[]>('/paymentMethods')
    if (!result.ok) return result

    const ids = new Set<number>()
    const codes = new Set<string>()
    const invalid = !Array.isArray(result.data) || result.data.some(method => {
        if (!method || typeof method !== 'object'
            || !Number.isSafeInteger(method.id) || method.id <= 0 || ids.has(method.id)
            || (method.code !== 'COD' && method.code !== 'ONLINE_DEMO') || codes.has(method.code)
            || typeof method.name !== 'string' || !method.name.trim()) {
            return true
        }
        ids.add(method.id)
        codes.add(method.code)
        return false
    })

    return invalid
        ? {ok: false, status: 200, message: 'Dữ liệu phương thức thanh toán không hợp lệ.'}
        : result
}
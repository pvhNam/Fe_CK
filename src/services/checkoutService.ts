import type { PaymentMethod, ShippingMethod } from '../types'
import { getJson } from './api'
import type { ApiResult } from './api'

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

export function getPaymentMethods() {
    return getJson<PaymentMethod[]>('/paymentMethods')
}
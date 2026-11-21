import type { Order } from '../types'
import { getJson, patchJson, postJson } from './api'
import type { ApiResult } from './api'

export function getOrders() {
    return getJson<Order[]>('/orders')
}

export function getOrderById(id: number) {
    return getJson<Order>(`/orders/${id}`)
}

export function createOrder(order: Omit<Order, 'id'>) {
    return postJson<Order>('/orders', order)
}

export async function submitCheckoutOrder(order: Omit<Order, 'id'>, retry: boolean): Promise<ApiResult<Order>> {
    if (retry) {
        const previous = await getJson<Order[]>(`/orders?requestId=${encodeURIComponent(order.requestId)}`)
        if (!previous.ok) return previous
        if (!Array.isArray(previous.data)) {
            return {ok: false, status: 200, message: 'Chưa kiểm tra được đơn đã gửi. Vui lòng thử lại.'}
        }
        const saved = previous.data.find(item => item?.requestId === order.requestId)
        if (saved) {
            if (Number.isSafeInteger(saved.id) && saved.id > 0) return {ok: true, data: saved}
            return {ok: false, status: 200, message: 'Chưa đọc được mã đơn đã gửi. Vui lòng thử lại.'}
        }
    }
    const result = await createOrder(order)
    if (result.ok && (result.data?.requestId !== order.requestId || !Number.isSafeInteger(result.data.id) || result.data.id <= 0)) {
        return {ok: false, status: 200, message: 'Chưa xác nhận được mã đơn. Vui lòng thử lại.'}
    }
    return result
}

export function updateOrder(id: number, changes: Partial<Omit<Order, 'id'>>) {
    return patchJson<Order>(`/orders/${id}`, changes)
}
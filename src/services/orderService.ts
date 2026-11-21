import type { Order } from '../types'
import { getJson, patchJson, postJson } from './api'
import type { ApiResult } from './api'

export function getOrders() {
    return getJson<Order[]>('/orders')
}

export async function getOrderById(id: number): Promise<ApiResult<Order>> {
    const result = await getJson<Order>(`/orders/${id}`)
    if (!result.ok) return result
    const order = result.data
    if (order?.id !== id || !order.customer || !Array.isArray(order.items) || !order.items.length
        || ![order.subtotal, order.shippingFee, order.total, order.discount ?? 0].every(Number.isFinite)
        || !order.items.every(item => item && typeof item.name === 'string' && Number.isFinite(item.unitPrice)
            && Number.isSafeInteger(item.quantity) && item.quantity > 0)) {
        return {ok: false, status: 200, message: 'Thông tin đơn hàng trả về không hợp lệ.'}
    }
    return result
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
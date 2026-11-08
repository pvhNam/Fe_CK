import type { Order } from '../types'
import { getJson, patchJson, postJson } from './api'

export function getOrders() {
    return getJson<Order[]>('/orders')
}

export function getOrderById(id: number) {
    return getJson<Order>(`/orders/${id}`)
}

export function createOrder(order: Omit<Order, 'id'>) {
    return postJson<Order>('/orders', order)
}

export function updateOrder(id: number, changes: Partial<Omit<Order, 'id'>>) {
    return patchJson<Order>(`/orders/${id}`, changes)
}
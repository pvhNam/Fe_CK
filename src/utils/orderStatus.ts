import type { Customer, DeliveryStatus, Order, PaymentCode } from '../types'

export type OrderChanges = Partial<Omit<Order, 'id'>>

export const NEXT_DELIVERY_STATUSES: Record<DeliveryStatus, DeliveryStatus[]> = {
    pending: ['preparing', 'cancelled'],
    preparing: ['shipping', 'cancelled'],
    shipping: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
}

export const PREVIOUS_DELIVERY_STATUS: Record<DeliveryStatus, DeliveryStatus | null> = {
    pending: null,
    preparing: 'pending',
    shipping: 'preparing',
    delivered: 'shipping',
    cancelled: null,
}

export const STEP_BACK_REASON_MAX = 200

export const DELIVERY_ACTION_LABELS: Record<DeliveryStatus, string> = {
    pending: 'Chuyển về chờ xác nhận',
    preparing: 'Xác nhận đơn',
    shipping: 'Bắt đầu giao hàng',
    delivered: 'Xác nhận đã giao',
    cancelled: 'Hủy đơn',
}

export function nextForwardStatus(status: DeliveryStatus): DeliveryStatus | null {
    return NEXT_DELIVERY_STATUSES[status].find((next) => next !== 'cancelled') ?? null
}

export function canCancel(status: DeliveryStatus): boolean {
    return NEXT_DELIVERY_STATUSES[status].includes('cancelled')
}

export function previousStatus(order: Order): DeliveryStatus | null {
    if (order.deliveryStatus === 'delivered' && order.paymentStatus === 'paid') return null
    return PREVIOUS_DELIVERY_STATUS[order.deliveryStatus]
}

export function canEditRecipient(status: DeliveryStatus): boolean {
    return status !== 'delivered' && status !== 'cancelled'
}

export function canCollectCash(order: Order, paymentCode: PaymentCode | null): boolean {
    return paymentCode === 'COD' && order.deliveryStatus === 'delivered' && order.paymentStatus === 'unpaid'
}

export function deliveryChanges(order: Order, next: DeliveryStatus, note?: string): OrderChanges {
    const now = new Date().toISOString()
    const event = note ? { status: next, at: now, note } : { status: next, at: now }
    return {
        deliveryStatus: next,
        updatedAt: now,
        statusHistory: [...(order.statusHistory ?? []), event],
    }
}

export function paidChanges(): OrderChanges {
    return { paymentStatus: 'paid', updatedAt: new Date().toISOString() }
}

export function recipientChanges(customer: Customer): OrderChanges {
    return { customer, updatedAt: new Date().toISOString() }
}
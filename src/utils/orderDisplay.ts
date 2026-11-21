import type { DeliveryStatus, OrderItem, PaymentCode, PaymentStatus } from '../types'

export const DELIVERY_LABELS: Record<DeliveryStatus, string> = {
    pending: 'Chờ xác nhận',
    preparing: 'Đang chuẩn bị',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
}

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
    unpaid: 'Chưa thanh toán',
    paid: 'Đã thanh toán',
}

export const PAYMENT_SHORT_NAMES: Record<PaymentCode, string> = {
    COD: 'Trả khi nhận hàng',
    ONLINE_DEMO: 'Thanh toán Online',
}

const TIME_ZONE = 'Asia/Ho_Chi_Minh'

function toDate(iso: string): Date | null {
    const date = new Date(iso)
    return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(iso: string): string {
    const date = toDate(iso)
    if (!date) return iso
    return date.toLocaleDateString('vi-VN', { timeZone: TIME_ZONE, day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatTime(iso: string): string {
    const date = toDate(iso)
    if (!date) return ''
    return date.toLocaleTimeString('vi-VN', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(iso: string): string {
    const time = formatTime(iso)
    return time ? `${time}, ${formatDate(iso)}` : iso
}

export function countPlants(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function summarizeItems(items: OrderItem[]): { main: string; extra: string } {
    if (items.length === 0) return { main: 'Không có sản phẩm', extra: '' }
    const [first, ...rest] = items
    const quantity = `× ${first.quantity}`
    return {
        main: first.name,
        extra: rest.length > 0 ? `${quantity} · +${rest.length} loại khác` : quantity,
    }
}

import type {PaymentCode, PaymentStatus} from '../types'

const SHIPPING_KEY = 'mam-xanh.checkout.shipping.v1'
const PAYMENT_KEY = 'mam-xanh.checkout.payment.v1'

export type OnlinePaymentResult = 'success' | 'failure' | 'cancelled'

export type PaymentDraft = {
    checkoutKey: string
    paymentMethodId: number
    code: PaymentCode
    paymentStatus: PaymentStatus
    onlineResult: OnlinePaymentResult | null
}

function isMethodId(value: unknown): value is number {
    return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}

export function readShippingMethodId(): number | null {
    try {
        const id = Number(window.sessionStorage.getItem(SHIPPING_KEY))
        return isMethodId(id) ? id : null
    } catch {
        return null
    }
}

export function writeShippingMethodId(id: number): void {
    window.sessionStorage.setItem(SHIPPING_KEY, String(id))
}

export function readPaymentDraft(): PaymentDraft | null {
    try {
        const raw = window.sessionStorage.getItem(PAYMENT_KEY)
        if (!raw) return null
        const draft: Partial<PaymentDraft> | null = JSON.parse(raw)
        if (!draft || typeof draft.checkoutKey !== 'string' || !isMethodId(draft.paymentMethodId)) return null
        if (draft.code === 'COD' && (draft.onlineResult !== null || draft.paymentStatus !== 'unpaid')) return null
        if (draft.code !== 'COD' && draft.code !== 'ONLINE_DEMO') return null
        const result = draft.onlineResult
        if (result !== null && result !== 'success' && result !== 'failure' && result !== 'cancelled') return null
        const paymentStatus = result === 'success' ? 'paid' : 'unpaid'
        if (draft.paymentStatus !== paymentStatus) return null
        return {checkoutKey: draft.checkoutKey, paymentMethodId: draft.paymentMethodId, code: draft.code,
            paymentStatus, onlineResult: result}
    } catch {
        return null
    }
}

export function writePaymentDraft(draft: PaymentDraft): void {
    window.sessionStorage.setItem(PAYMENT_KEY, JSON.stringify(draft))
}
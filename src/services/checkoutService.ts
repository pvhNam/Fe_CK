import type { PaymentMethod, ShippingMethod } from '../types'
import { getJson } from './api'

export function getShippingMethods() {
    return getJson<ShippingMethod[]>('/shippingMethods')
}

export function getPaymentMethods() {
    return getJson<PaymentMethod[]>('/paymentMethods')
}
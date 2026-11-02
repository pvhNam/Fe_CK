export type Category = {
    id: number
    name: string
}

export type BagSize = 'Bầu ươm' | 'Bầu nhỏ'

export type NewProduct = {
    name: string
    categoryId: number
    price: number
    stock: number
    heightCm: number
    bagSize: BagSize
    imageUrl: string
    description: string
    careGuide: string
    active: boolean
}

export type Product = NewProduct & { id: number }

export type NewNews = {
    title: string
    summary: string
    content: string
    imageUrl: string
    publishedAt: string
    isPublished: boolean
}

export type News = NewNews & { id: number }

export type ShippingMethod = {
    id: number
    name: string
    fee: number
    estimatedDays: string
}

export type PaymentCode = 'COD' | 'ONLINE_DEMO'

export type PaymentMethod = {
    id: number
    code: PaymentCode
    name: string
}

export type PaymentStatus = 'unpaid' | 'paid'

export type DeliveryStatus =
    | 'pending'
    | 'preparing'
    | 'shipping'
    | 'delivered'
    | 'cancelled'

export type Customer = {
    name: string
    phone: string
    region: string
    address: string
    note?: string
}

export type OrderItem = {
    productId: number
    name: string
    unitPrice: number
    quantity: number
}

export type NewOrder = {
    customer: Customer
    items: OrderItem[]
    shippingMethodId: number
    shippingFee: number
    paymentMethodId: number
    paymentStatus: PaymentStatus
    deliveryStatus: DeliveryStatus
    subtotal: number
    discount?: number
    total: number
    createdAt: string
}

export type Order = NewOrder & { id: number }
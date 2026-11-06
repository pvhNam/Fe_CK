import type { CartItem, CartProduct, CartTotals, OrderItem } from '../types'

function validateMoney(amount: number, label: string): void {
    if (!Number.isSafeInteger(amount) || amount < 0) {
        throw new RangeError(`${label} phải là số nguyên không âm trong phạm vi an toàn`)
    }
}

export function validateCartQuantity(quantity: number, stock: number): void {
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
        throw new RangeError('Số lượng phải là số nguyên lớn hơn 0')
    }
    if (!Number.isSafeInteger(stock) || stock < 0) {
        throw new RangeError('Tồn kho mẫu phải là số nguyên không âm')
    }
    if (quantity > stock) {
        throw new RangeError(`Số lượng vượt tồn kho mẫu. Chỉ còn ${stock} sản phẩm.`)
    }
}

export function calculateItemTotal(product: CartProduct, quantity: number): number {
    validateCartQuantity(quantity, product.stock)
    validateMoney(product.price, `Đơn giá ${product.name}`)
    const total = product.price * quantity
    validateMoney(total, `Thành tiền ${product.name}`)
    return total
}

/**
 * Tính theo giá/tồn kho hiện tại, không sửa giỏ hoặc sản phẩm đầu vào.
 * Cùng productId được gộp trước khi kiểm tra tổng số lượng
 */
export function calculateCartTotals(
    cart: readonly CartItem[],
    products: readonly CartProduct[],
    shippingFee = 0,
): CartTotals {
    validateMoney(shippingFee, 'Phí vận chuyển')

    const productById = new Map<number, CartProduct>()
    for (const product of products) {
        if (!Number.isSafeInteger(product.id) || product.id <= 0) {
            throw new RangeError('Mã sản phẩm mẫu phải là số nguyên dương')
        }
        if (productById.has(product.id)) {
            throw new Error(`Dữ liệu mẫu bị trùng mã sản phẩm ${product.id}`)
        }
        productById.set(product.id, product)
    }

    const quantities = new Map<number, number>()
    for (const item of cart) {
        if (!Number.isSafeInteger(item.productId) || item.productId <= 0) {
            throw new RangeError('Mã sản phẩm trong giỏ phải là số nguyên dương')
        }
        const product = productById.get(item.productId)
        if (!product) {
            throw new Error(`Không tìm thấy sản phẩm ${item.productId}`)
        }
        validateCartQuantity(item.quantity, product.stock)
        const quantity = (quantities.get(item.productId) ?? 0) + item.quantity
        validateCartQuantity(quantity, product.stock)
        quantities.set(item.productId, quantity)
    }

    const items: OrderItem[] = []
    let subtotal = 0
    for (const [productId, quantity] of quantities) {
        const product = productById.get(productId)!
        subtotal += calculateItemTotal(product, quantity)
        validateMoney(subtotal, 'Tiền hàng')
        items.push({ productId, name: product.name, unitPrice: product.price, quantity })
    }

    // Giỏ trống hiển thị 0, không tính phí giao hàng khi chưa có sản phẩm
    const appliedShippingFee = items.length ? shippingFee : 0
    const total = subtotal + appliedShippingFee
    validateMoney(total, 'Tổng thanh toán')
    return { items, subtotal, shippingFee: appliedShippingFee, total }
}

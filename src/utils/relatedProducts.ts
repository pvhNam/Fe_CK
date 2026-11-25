import type { Product } from '../types'

export const RELATED_LIMIT = 4

export function pickRelatedProducts(products: readonly Product[], current: Product, limit = RELATED_LIMIT): Product[] {
    return products
        .filter((product) => product.active && product.id !== current.id && product.categoryId === current.categoryId)
        .sort((a, b) =>
            Number(b.stock > 0) - Number(a.stock > 0)
            || Math.abs(a.price - current.price) - Math.abs(b.price - current.price)
            || a.id - b.id)
        .slice(0, limit)
}
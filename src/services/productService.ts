import type { Category, NewProduct, Product } from '../types'
import { getJson, patchJson, postJson } from './api'

export function getCategories() {
    return getJson<Category[]>('/categories')
}

export function getProducts() {
    return getJson<Product[]>('/products')
}

export function getActiveProducts(categoryId?: number) {
    const filter = categoryId ? `&categoryId=${categoryId}` : ''
    return getJson<Product[]>(`/products?active=true${filter}`)
}

export function getProductById(id: number) {
    return getJson<Product>(`/products/${id}`)
}

export function createProduct(product: NewProduct) {
    return postJson<Product>('/products', product)
}

export function updateProduct(id: number, changes: Partial<NewProduct>) {
    return patchJson<Product>(`/products/${id}`, changes)
}
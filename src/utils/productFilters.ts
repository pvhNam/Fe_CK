import type { Product } from '../types'

export type PriceRangeId = 'all' | 'under-20k' | '20k-50k' | 'over-50k'
export type SortOrder = 'default' | 'price-asc' | 'price-desc'

export type ProductFilterValues = {
    keyword: string
    categoryId: number | null
    priceRange: PriceRangeId
    sort: SortOrder
}

type PriceRange = {
    id: PriceRangeId
    label: string
    min: number
    max: number
}

export const PRICE_RANGES: PriceRange[] = [
    { id: 'all', label: 'Mọi mức giá', min: 0, max: Infinity },
    { id: 'under-20k', label: 'Dưới 20.000 ₫', min: 0, max: 19999 },
    { id: '20k-50k', label: '20.000 ₫ – 50.000 ₫', min: 20000, max: 50000 },
    { id: 'over-50k', label: 'Trên 50.000 ₫', min: 50001, max: Infinity },
]

export const SORT_OPTIONS: { id: SortOrder; label: string }[] = [
    { id: 'default', label: 'Mặc định' },
    { id: 'price-asc', label: 'Giá tăng dần' },
    { id: 'price-desc', label: 'Giá giảm dần' },
]

export const DEFAULT_FILTERS: ProductFilterValues = {
    keyword: '',
    categoryId: null,
    priceRange: 'all',
    sort: 'default',
}

function toLowerText(text: string): string {
    return text.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim()
}

function removeAccents(text: string): string {
    return toLowerText(text)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
}

const TONE_MARKS = /[\u0300\u0301\u0303\u0309\u0323]/g

function removeTones(text: string): string {
    return toLowerText(text).normalize('NFD').replace(TONE_MARKS, '').normalize('NFC')
}

function matchesKeyword(name: string, rawKeyword: string): boolean {
    const plain = removeAccents(rawKeyword)
    if (plain === '') return true

    const toneless = removeTones(rawKeyword)
    const keepLetters = toneless !== plain
    const prepare = keepLetters ? removeTones : removeAccents
    const keyword = keepLetters ? toneless : plain

    return ` ${prepare(name)}`.includes(` ${keyword}`)
}

export function hasActiveFilters(filters: ProductFilterValues): boolean {
    return (
        filters.keyword.trim() !== '' ||
        filters.categoryId !== null ||
        filters.priceRange !== 'all' ||
        filters.sort !== 'default'
    )
}

export function filterProducts(products: Product[], filters: ProductFilterValues): Product[] {
    const range = PRICE_RANGES.find((item) => item.id === filters.priceRange) ?? PRICE_RANGES[0]

    const result = products.filter(
        (product) =>
            matchesKeyword(product.name, filters.keyword) &&
            (filters.categoryId === null || product.categoryId === filters.categoryId) &&
            product.price >= range.min &&
            product.price <= range.max,
    )

    if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price)

    return result
}
import type { BagSize, CareLevel, NewProduct, Product, Sunlight } from '../types'

export const BAG_SIZES: BagSize[] = ['Bầu ươm', 'Bầu nhỏ']

export type ProductFormValues = {
    name: string
    categoryId: string
    price: string
    stock: string
    heightCm: string
    bagSize: BagSize
    sunlight: Sunlight
    careLevel: CareLevel
    imageUrl: string
    description: string
    careGuide: string
    active: boolean
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    heightCm: '',
    bagSize: 'Bầu nhỏ',
    sunlight: 'full',
    careLevel: 'easy',
    imageUrl: '',
    description: '',
    careGuide: '',
    active: true,
}

export function toFormValues(product: Product): ProductFormValues {
    return {
        name: product.name,
        categoryId: String(product.categoryId),
        price: String(product.price),
        stock: String(product.stock),
        heightCm: String(product.heightCm),
        bagSize: product.bagSize,
        sunlight: product.sunlight,
        careLevel: product.careLevel,
        imageUrl: product.imageUrl,
        description: product.description,
        careGuide: product.careGuide,
        active: product.active,
    }
}

function parseWholeNumber(text: string): number | null {
    const compact = text.replace(/\s/g, '')
    if (/^\d+$/.test(compact)) return Number(compact)
    if (/^\d{1,3}(\.\d{3})+$/.test(compact)) return Number(compact.replace(/\./g, ''))
    return null
}

function sameName(a: string, b: string): boolean {
    const clean = (text: string) => text.normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase()
    return clean(a) === clean(b)
}

export function validateProductForm(
    values: ProductFormValues,
    takenNames: string[],
    categoryIds: number[],
): { errors: ProductFormErrors; product: NewProduct | null } {
    const errors: ProductFormErrors = {}

    const name = values.name.trim().replace(/\s+/g, ' ')
    if (name.length < 2) errors.name = 'Tên cây cần ít nhất 2 ký tự.'
    else if (name.length > 80) errors.name = 'Tên cây tối đa 80 ký tự.'
    else if (takenNames.some((taken) => sameName(taken, name))) errors.name = 'Đã có cây khác trùng tên này.'

    const categoryId = Number(values.categoryId)
    if (!categoryIds.includes(categoryId)) errors.categoryId = 'Hãy chọn danh mục.'

    const price = parseWholeNumber(values.price)
    if (price === null) errors.price = 'Giá là số nguyên, ví dụ 85000 hoặc 85.000.'
    else if (price < 1000 || price > 10000000) errors.price = 'Giá từ 1.000 ₫ đến 10.000.000 ₫.'

    const stock = parseWholeNumber(values.stock)
    if (stock === null) errors.stock = 'Số lượng là số nguyên, không âm.'
    else if (stock > 10000) errors.stock = 'Số lượng tối đa 10.000 cây.'

    const heightCm = parseWholeNumber(values.heightCm)
    if (heightCm === null || heightCm < 1 || heightCm > 500) errors.heightCm = 'Chiều cao là số nguyên từ 1 đến 500 cm.'

    const imageUrl = values.imageUrl.trim()
    if (!/^(\/|https?:\/\/)\S+$/.test(imageUrl)) errors.imageUrl = 'Đường dẫn ảnh bắt đầu bằng / hoặc http(s)://'

    const description = values.description.trim()
    if (description.length < 10) errors.description = 'Mô tả cần ít nhất 10 ký tự.'

    const careGuide = values.careGuide.trim()
    if (careGuide.length < 10) errors.careGuide = 'Hướng dẫn chăm sóc cần ít nhất 10 ký tự.'

    if (Object.keys(errors).length > 0 || price === null || stock === null || heightCm === null) {
        return { errors, product: null }
    }

    return {
        errors,
        product: {
            name,
            categoryId,
            price,
            stock,
            heightCm,
            bagSize: values.bagSize,
            sunlight: values.sunlight,
            careLevel: values.careLevel,
            imageUrl,
            description,
            careGuide,
            active: values.active,
        },
    }
}
import type {CartItem, CartTotals} from '../types'
import {getProducts} from '../services/productService'
import {calculateCartTotals} from '../utils/cart'
import {useApiData} from './useApiData'

export function useCheckoutTotals(items: readonly CartItem[], shippingFee: number) {
    const {data, retry} = useApiData(getProducts)
    let totals: CartTotals | null = null
    let error: string | null = data && !data.ok ? data.message : null

    if (data?.ok) {
        try {
            if (!Array.isArray(data.data)) throw new TypeError('Dữ liệu sản phẩm không hợp lệ.')
            const activeProducts = data.data.filter(product => product?.active === true)
            totals = calculateCartTotals(items, activeProducts, shippingFee)
        } catch (cause) {
            error = cause instanceof Error ? cause.message : 'Chưa tính được tiền giỏ hàng.'
        }
    }

    return {totals, error, loading: data === null, retry}
}
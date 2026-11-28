import type {Category, NewProduct, Order, Product} from '../types'
import type {ApiResult} from '../services/api'
import {createProduct, getCategories, getProducts, updateProduct} from '../services/productService'
import {getOrders, updateOrder} from '../services/orderService'
import type {OrderChanges} from '../utils/orderStatus'
import {purchaseApi} from './purchaseApi'

async function savedItem<T>(queryFulfilled: Promise<{ data: ApiResult<T> }>): Promise<T | null> {
    try {
        const {data} = await queryFulfilled
        return data.ok ? data.data : null
    } catch {
        return null
    }
}

function replaceItem<T extends { id: number }>(list: ApiResult<T[]>, saved: T) {
    if (!list.ok) return
    const index = list.data.findIndex((item) => item.id === saved.id)
    if (index >= 0) list.data[index] = saved
}

export const adminApi = purchaseApi.injectEndpoints({
    endpoints: (build) => ({
        adminProducts: build.query<ApiResult<Product[]>, void>({
            queryFn: async () => ({data: await getProducts()}),
        }),
        adminCategories: build.query<ApiResult<Category[]>, void>({
            queryFn: async () => ({data: await getCategories()}),
        }),
        addProduct: build.mutation<ApiResult<Product>, NewProduct>({
            queryFn: async (product) => ({data: await createProduct(product)}),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                const saved = await savedItem(queryFulfilled)
                if (!saved) return
                dispatch(adminApi.util.updateQueryData('adminProducts', undefined, (list) => {
                    if (list.ok) list.data.push(saved)
                }))
            },
        }),
        editProduct: build.mutation<ApiResult<Product>, { id: number; changes: Partial<NewProduct> }>({
            queryFn: async ({id, changes}) => ({data: await updateProduct(id, changes)}),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                const saved = await savedItem(queryFulfilled)
                if (!saved) return
                dispatch(adminApi.util.updateQueryData('adminProducts', undefined, (list) => replaceItem(list, saved)))
            },
        }),
        adminOrders: build.query<ApiResult<Order[]>, void>({
            queryFn: async () => ({data: await getOrders()}),
        }),
        editOrder: build.mutation<ApiResult<Order>, { id: number; changes: OrderChanges }>({
            queryFn: async ({id, changes}) => ({data: await updateOrder(id, changes)}),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                const saved = await savedItem(queryFulfilled)
                if (!saved) return
                dispatch(adminApi.util.updateQueryData('adminOrders', undefined, (list) => replaceItem(list, saved)))
            },
        }),
    }),
})

export const {
    useAdminProductsQuery,
    useAdminCategoriesQuery,
    useAddProductMutation,
    useEditProductMutation,
    useAdminOrdersQuery,
    useEditOrderMutation,
    usePaymentsQuery,
    useShippingQuery,
} = adminApi

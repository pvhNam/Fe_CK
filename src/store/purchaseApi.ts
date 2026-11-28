import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react'
import {getProducts} from '../services/productService'
import {getCoupons, getPaymentMethods, getShippingMethods} from '../services/checkoutService'
import {getOrderById, submitCheckoutOrder} from '../services/orderService'
import {readOrderIds} from '../utils/orderHistoryStorage'
import type {ApiResult} from '../services/api'

function queryView<T extends ApiResult<unknown>>(query: {currentData?: T; isError: boolean; isFetching: boolean; refetch: () => unknown}) {
    const failure = {ok: false as const, status: 0, message: 'Chưa tải được dữ liệu. Vui lòng thử lại.'}
    return {data: query.isError ? failure : query.isFetching ? null : query.currentData ?? null, retry: query.refetch}
}

type Result<F extends (...args: never[]) => unknown> = Awaited<ReturnType<F>>

export const purchaseApi = createApi({
    reducerPath: 'purchaseApi',
    baseQuery: fakeBaseQuery(),
    refetchOnMountOrArgChange: true,
    tagTypes: ['History'],
    endpoints: build => ({
        history: build.query<number[], void>({
            queryFn: () => {
                try {
                    return {data: readOrderIds()}
                } catch {
                    return {error: {message: 'Không đọc được lịch sử đơn trên trình duyệt này.'}}
                }
            },
            providesTags: ['History'],
        }),
        products: build.query<Result<typeof getProducts>, void>({
            queryFn: async () => ({data: await getProducts()}),
        }),
        shipping: build.query<Result<typeof getShippingMethods>, void>({
            queryFn: async () => ({data: await getShippingMethods()}),
        }),
        payments: build.query<Result<typeof getPaymentMethods>, void>({
            queryFn: async () => ({data: await getPaymentMethods()}),
        }),
        coupons: build.query<Result<typeof getCoupons>, void>({
            queryFn: async () => ({data: await getCoupons()}),
        }),
        order: build.query<Result<typeof getOrderById>, number>({
            queryFn: async id => ({data: await getOrderById(id)}),
        }),
        placeOrder: build.mutation<Result<typeof submitCheckoutOrder>, Parameters<typeof submitCheckoutOrder>>({
            queryFn: async args => ({data: await submitCheckoutOrder(...args)}),
        }),
    }),
})

export function useProductsData() {
    return queryView<Result<typeof getProducts>>(purchaseApi.useProductsQuery())
}

export function useCouponsData() {
    return queryView<Result<typeof getCoupons>>(purchaseApi.useCouponsQuery())
}

export function useShippingData() {
    return queryView<Result<typeof getShippingMethods>>(purchaseApi.useShippingQuery())
}

export function usePaymentsData() {
    return queryView<Result<typeof getPaymentMethods>>(purchaseApi.usePaymentsQuery())
}

export function useOrderData(id: number) {
    return queryView<Result<typeof getOrderById>>(purchaseApi.useOrderQuery(id))
}

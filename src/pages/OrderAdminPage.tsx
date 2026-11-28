import { useState } from 'react'
import type { Order, PaymentCode } from '../types'
import { useAdminOrdersQuery, useEditOrderMutation, usePaymentsQuery, useShippingQuery } from '../store/adminApi'
import { formatVND } from '../utils/currency'
import {
    DELIVERY_LABELS,
    PAYMENT_LABELS,
    PAYMENT_SHORT_NAMES,
    formatDate,
    formatTime,
    summarizeItems,
} from '../utils/orderDisplay'
import type { OrderChanges } from '../utils/orderStatus'
import OrderDetail from '../components/OrderDetail'
import StatePanel from '../components/StatePanel'
import '../style/ProductListPage.css'
import '../style/ProductAdminPage.css'
import '../style/OrderAdminPage.css'

function OrderAdminPage() {
    const ordersQuery = useAdminOrdersQuery()
    const paymentsQuery = usePaymentsQuery()
    const shippingQuery = useShippingQuery()
    const [editOrder] = useEditOrderMutation()
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [viewedId, setViewedId] = useState<number | null>(null)

    const orderResult = ordersQuery.data
    const orders = orderResult?.ok ? orderResult.data : []
    const paymentMethods = paymentsQuery.data?.ok ? paymentsQuery.data.data : []
    const shippingMethods = shippingQuery.data?.ok ? shippingQuery.data.data : []
    const loading = !orderResult || (ordersQuery.isFetching && !orderResult.ok)
    const loadError = !loading && !orderResult.ok ? orderResult.message : ''
    const reloading = ordersQuery.isFetching

    function reload() {
        void ordersQuery.refetch()
        void paymentsQuery.refetch()
        void shippingQuery.refetch()
    }

    function openDetail(id: number) {
        setSelectedId(id)
        setViewedId(id)
    }

    const paymentNames = new Map(paymentMethods.map((method) => [method.id, method.name]))
    const shippingNames = new Map(shippingMethods.map((method) => [method.id, method.name]))

    function paymentNameOf(order: Order) {
        return order.paymentMethod?.name ?? paymentNames.get(order.paymentMethodId) ?? `Cách trả #${order.paymentMethodId}`
    }

    function paymentCodeOf(order: Order): PaymentCode | null {
        return order.paymentMethod?.code
            ?? paymentMethods.find((method) => method.id === order.paymentMethodId)?.code
            ?? null
    }

    function paymentShortNameOf(order: Order) {
        const code = paymentCodeOf(order)
        return code ? PAYMENT_SHORT_NAMES[code] : paymentNameOf(order)
    }

    function shippingNameOf(order: Order) {
        return order.shippingMethod?.name ?? shippingNames.get(order.shippingMethodId) ?? `Cách giao #${order.shippingMethodId}`
    }

    async function saveOrder(id: number, changes: OrderChanges): Promise<string | null> {
        const result = await editOrder({ id, changes }).unwrap()
        return result.ok ? null : result.message
    }

    const ready = !loading && !loadError
    const rows = [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() || b.id - a.id,
    )
    const selected = orders.find((order) => order.id === selectedId) ?? null

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <div className="product-admin__intro">
                        <h1>Quản lý đơn hàng</h1>
                        <p>Xem đơn khách đã đặt: người nhận, cây đã mua, tổng tiền, cách trả tiền và cách giao.</p>
                    </div>
                    {ready && (
                        <button type="button" className="product-admin__add" onClick={reload} disabled={reloading}>
                            {reloading ? 'Đang tải...' : 'Tải lại đơn'}
                        </button>
                    )}
                </header>

                {loading && <StatePanel variant="loading">Đang tải danh sách đơn...</StatePanel>}

                {!loading && loadError && (
                    <StatePanel variant="error" title="Chưa tải được danh sách đơn" actionLabel="Thử lại" onAction={reload}>
                        {loadError}
                    </StatePanel>
                )}

                {ready && rows.length === 0 && (
                    <StatePanel variant="empty" title="Chưa có đơn hàng nào">
                        Đơn sẽ hiện ở đây sau khi khách đặt hàng.
                    </StatePanel>
                )}

                {ready && rows.length > 0 && (
                    <>
                        {selected && (
                            <OrderDetail
                                key={selected.id}
                                order={selected}
                                paymentName={paymentNameOf(selected)}
                                paymentCode={paymentCodeOf(selected)}
                                shippingName={shippingNameOf(selected)}
                                onUpdate={(changes) => saveOrder(selected.id, changes)}
                                onClose={() => setSelectedId(null)}
                            />
                        )}

                        <p className="product-admin__count" role="status">
                            Có {rows.length} đơn, đơn mới nhất ở trên cùng.
                        </p>

                        <div className="product-admin__table-wrap order-admin__table-wrap">
                            <table className="product-admin__table order-admin__table">
                                <caption>Danh sách đơn hàng</caption>
                                <thead>
                                <tr>
                                    <th scope="col">Đơn hàng</th>
                                    <th scope="col">Khách hàng</th>
                                    <th scope="col">Sản phẩm</th>
                                    <th scope="col">Thanh toán</th>
                                    <th scope="col">Giao hàng</th>
                                    <th scope="col" className="is-number">Tổng tiền</th>
                                    <th scope="col"><span className="order-admin__sr">Thao tác</span></th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.map((order) => {
                                    const items = summarizeItems(order.items)
                                    const time = formatTime(order.createdAt)

                                    return (
                                        <tr key={order.id} className={order.id === viewedId ? 'is-viewed' : undefined}>
                                            <td className="order-admin__order">
                                                <span className="order-admin__main">#{order.id}</span>
                                                <span className="order-admin__sub">
                                                    {formatDate(order.createdAt)}{time && ` · ${time}`}
                                                </span>
                                            </td>
                                            <td className="order-admin__customer">
                                                <span className="order-admin__main">{order.customer.name}</span>
                                                <span className="order-admin__sub">{order.customer.phone}</span>
                                            </td>
                                            <td className="order-admin__items">
                                                <span className="order-admin__main">{items.main}</span>
                                                {items.extra && <span className="order-admin__sub">{items.extra}</span>}
                                            </td>
                                            <td className="order-admin__payment">
                                                <span className={`product-admin__badge order-badge is-${order.paymentStatus}`}>
                                                    {PAYMENT_LABELS[order.paymentStatus]}
                                                </span>
                                                <span className="order-admin__sub">{paymentShortNameOf(order)}</span>
                                            </td>
                                            <td className="order-admin__delivery">
                                                <span className={`product-admin__badge order-badge is-${order.deliveryStatus}`}>
                                                    {DELIVERY_LABELS[order.deliveryStatus]}
                                                </span>
                                                <span className="order-admin__sub">{shippingNameOf(order)}</span>
                                            </td>
                                            <td className="order-admin__total is-number">{formatVND(order.total)}</td>
                                            <td className="order-admin__action">
                                                <button
                                                    type="button"
                                                    className="order-admin__view"
                                                    onClick={() => openDetail(order.id)}
                                                    aria-label={`Xem chi tiết đơn #${order.id}`}
                                                >
                                                    Xem<span className="order-admin__view-extra"> chi tiết</span>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

export default OrderAdminPage
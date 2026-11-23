import { useCallback } from 'react'
import { useApiData } from '../hooks/useApiData'
import { getOrderById } from '../services/orderService'
import type { Order } from '../types'
import { formatVND } from '../utils/currency'
import { DELIVERY_LABELS, formatDateTime, PAYMENT_LABELS } from '../utils/orderDisplay'
import OrderProgress from '../components/OrderProgress'
import '../style/OrderConfirmationPage.css'
import StatePanel from '../components/StatePanel'

function OrderTracking({ order, onRefresh, refreshing }: { order: Order; onRefresh: () => void; refreshing: boolean }) {
    const paymentClass = `order-confirmation__status-value is-${order.paymentStatus}`
    const deliveryClass = `order-confirmation__status-value is-${order.deliveryStatus}`

    return (
        <section className="order-confirmation__tracking" aria-labelledby="order-tracking-title">
            <div className="order-confirmation__tracking-head">
                <div>
                    <h2 id="order-tracking-title">Theo dõi giao hàng</h2>
                </div>
                <button
                    type="button"
                    className="order-confirmation__refresh"
                    onClick={onRefresh}
                    disabled={refreshing}
                >
                    {refreshing ? 'Đang tải...' : 'Tải lại trạng thái'}
                </button>
            </div>
            <div className="order-confirmation__status-grid">
                <div className="order-confirmation__status-card">
                    <span className="order-confirmation__status-label">Trạng thái giao hàng</span>
                    <strong className={deliveryClass}>{DELIVERY_LABELS[order.deliveryStatus]}</strong>
                </div>
                <div className="order-confirmation__status-card">
                    <span className="order-confirmation__status-label">Trạng thái thanh toán</span>
                    <strong className={paymentClass}>{PAYMENT_LABELS[order.paymentStatus]}</strong>
                </div>
            </div>
            <OrderProgress order={order} />
            <p className="order-confirmation__updated">
                Cập nhật lần cuối: {formatDateTime(order.updatedAt || order.createdAt)}
            </p>
        </section>
    )
}

function OrderDetails({ order }: { order: Order }) {
    const { customer, shippingMethod, paymentMethod } = order
    return (
        <div className="order-confirmation__details">
            <section className="order-confirmation__panel" aria-labelledby="ordered-items">
                <h2 id="ordered-items">Sản phẩm đã đặt</h2>
                <ul className="order-confirmation__items">
                    {order.items.map(item => (
                        <li key={item.productId}>
                            <div><strong>{item.name}</strong><small>{item.quantity} × {formatVND(item.unitPrice)}</small></div>
                            <strong>{formatVND(item.quantity * item.unitPrice)}</strong>
                        </li>
                    ))}
                </ul>
                <dl className="order-confirmation__totals">
                    <div><dt>Tiền hàng</dt><dd>{formatVND(order.subtotal)}</dd></div>
                    <div><dt>Phí giao hàng</dt><dd>{formatVND(order.shippingFee)}</dd></div>
                    {!!order.discount && <div><dt>Giảm giá</dt><dd>−{formatVND(order.discount)}</dd></div>}
                    <div><dt>Tổng đơn hàng</dt><dd>{formatVND(order.total)}</dd></div>
                </dl>
            </section>
            <div className="order-confirmation__panel">
                <section aria-labelledby="order-customer">
                    <h2 id="order-customer">Người nhận</h2>
                    <p><strong>{customer.name}</strong></p>
                    <p>{customer.phone}</p>
                    <p>{customer.address}, {customer.region}</p>
                    {customer.note && <p className="order-confirmation__note">Ghi chú · {customer.note}</p>}
                </section>
                <section aria-labelledby="order-payment">
                    <h2 id="order-payment">Thanh toán</h2>
                    <p>{paymentMethod?.name ?? `Phương thức #${order.paymentMethodId}`}</p>
                    <p>{PAYMENT_LABELS[order.paymentStatus]}</p>
                </section>
                <section aria-labelledby="order-shipping">
                    <h2 id="order-shipping">Giao hàng</h2>
                    <p>{shippingMethod?.name ?? `Phương thức #${order.shippingMethodId}`}</p>
                    {shippingMethod?.estimatedDays && <p>Dự kiến {shippingMethod.estimatedDays}</p>}
                    <p>{DELIVERY_LABELS[order.deliveryStatus]}</p>
                </section>
            </div>
        </div>
    )
}

export default function OrderConfirmationPage({ orderId }: { orderId: number }) {
    const loadOrder = useCallback(() => getOrderById(orderId), [orderId])
    const { data, retry } = useApiData(loadOrder)
    const checkCart = new URLSearchParams(window.location.search).get('kiem-tra-gio') === '1'
    const refreshing = data === null

    return (
        <main className="order-confirmation">
            <header>
                <p className="order-confirmation__eyebrow">Mầm Xanh · Đơn hàng của bạn</p>
                <h1>Thông tin đơn hàng</h1>
                <p>Mã đơn <strong>#{orderId}</strong></p>
            </header>
            {checkCart && <p role="alert">Đơn đã được lưu. Vui lòng kiểm tra lại giỏ hàng và thông tin checkout trước lần mua tiếp theo.</p>}
            {data === null && <StatePanel variant="loading">Đang tải thông tin đơn hàng...</StatePanel>}
            {data && !data.ok && (
                <StatePanel
                    variant={data.status === 404 ? 'empty' : 'error'}
                    title={data.status === 404 ? `Không tìm thấy đơn hàng #${orderId}` : 'Chưa tải được đơn hàng'}
                    actionLabel={data.status === 404 ? undefined : 'Tải lại đơn hàng'}
                    onAction={data.status === 404 ? undefined : retry}
                >
                    {data.status === 404 ? 'Kiểm tra lại mã đơn trong đường dẫn.' : data.message}
                </StatePanel>
            )}
            {data?.ok && (
                <>
                    <OrderTracking order={data.data} onRefresh={retry} refreshing={refreshing} />
                    <OrderDetails order={data.data} />
                </>
            )}
            <a className="order-confirmation__continue" href="/san-pham">Tiếp tục mua sắm</a>
        </main>
    )
}
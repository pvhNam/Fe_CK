import {useCallback} from 'react'
import {useApiData} from '../hooks/useApiData'
import {getOrderById} from '../services/orderService'
import type {DeliveryStatus, Order} from '../types'
import {formatVND} from '../utils/currency'
import '../style/OrderConfirmationPage.css'

const deliveryLabels: Record<DeliveryStatus, string> = {
    pending: 'Chờ xác nhận',
    preparing: 'Đang chuẩn bị',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
}

function OrderDetails({order}: {order: Order}) {
    const {customer, shippingMethod, paymentMethod} = order
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
                    <p>{order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                </section>
                <section aria-labelledby="order-shipping">
                    <h2 id="order-shipping">Giao hàng</h2>
                    <p>{shippingMethod?.name ?? `Phương thức #${order.shippingMethodId}`}</p>
                    {shippingMethod?.estimatedDays && <p>Dự kiến {shippingMethod.estimatedDays}</p>}
                    <p>{deliveryLabels[order.deliveryStatus]}</p>
                </section>
            </div>
        </div>
    )
}

export default function OrderConfirmationPage({orderId}: {orderId: number}) {
    const loadOrder = useCallback(() => getOrderById(orderId), [orderId])
    const {data, retry} = useApiData(loadOrder)
    const checkCart = new URLSearchParams(window.location.search).get('kiem-tra-gio') === '1'
    return (
        <main className="order-confirmation">
            <header>
                <h1>{data?.ok ? 'Đặt hàng thành công' : 'Xác nhận đơn hàng'}</h1>
                <p>Mã đơn <strong>#{orderId}</strong></p>
            </header>
            {checkCart && <p role="alert">Đơn đã được lưu. Vui lòng kiểm tra lại giỏ hàng và thông tin checkout trước lần mua tiếp theo.</p>}
            {data === null && <p role="status">Đang tải thông tin đơn hàng…</p>}
            {data && !data.ok && (
                <div className="order-confirmation__panel">
                    <p role="alert">{data.status === 404 ? `Không tìm thấy đơn hàng #${orderId}.` : data.message}</p>
                    <button type="button" onClick={retry}>Tải lại đơn hàng</button>
                </div>
            )}
            {data?.ok && <OrderDetails order={data.data} />}
            <a className="order-confirmation__continue" href="/san-pham">Tiếp tục mua sắm</a>
        </main>
    )
}
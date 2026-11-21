import { useEffect, useRef, useState } from 'react'
import type { Order } from '../types'
import { formatVND } from '../utils/currency'
import { DELIVERY_LABELS, PAYMENT_LABELS, countPlants, formatDateTime } from '../utils/orderDisplay'
import '../style/ProductForm.css'

type OrderDetailProps = {
    order: Order
    paymentName: string
    shippingName: string
    onClose: () => void
}

const CLOSE_ANIMATION_MS = 180

function OrderDetail({ order, paymentName, shippingName, onClose }: OrderDetailProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [closing, setClosing] = useState(false)
    const { customer } = order
    const estimatedDays = order.shippingMethod?.estimatedDays

    useEffect(() => {
        const dialog = dialogRef.current
        if (dialog && !dialog.open) dialog.showModal()
    }, [])

    function closeDialog() {
        if (closing) return
        setClosing(true)
        window.setTimeout(() => dialogRef.current?.close(), CLOSE_ANIMATION_MS)
    }

    return (
        <dialog
            ref={dialogRef}
            className={`product-dialog order-dialog ${closing ? 'is-closing' : ''}`}
            aria-labelledby="order-dialog-title"
            onCancel={(event) => {
                event.preventDefault()
                closeDialog()
            }}
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) closeDialog()
            }}
        >
            <div className="order-dialog__panel">
                <header className="order-dialog__header">
                    <span className="order-dialog__grip" aria-hidden="true" />
                    <div className="order-dialog__title">
                        <h2 id="order-dialog-title">Đơn hàng #{order.id}</h2>
                        <p>Đặt lúc {formatDateTime(order.createdAt)}</p>
                    </div>
                    <button
                        type="button"
                        className="product-form__close"
                        onClick={closeDialog}
                        aria-label="Đóng chi tiết đơn"
                    >
                        ×
                    </button>
                </header>

                <div className="order-dialog__body">
                    <div className="order-dialog__status">
                        <div>
                            Thanh toán
                            <span className={`product-admin__badge order-badge is-${order.paymentStatus}`}>
                                {PAYMENT_LABELS[order.paymentStatus]}
                            </span>
                        </div>
                        <div>
                            Giao hàng
                            <span className={`product-admin__badge order-badge is-${order.deliveryStatus}`}>
                                {DELIVERY_LABELS[order.deliveryStatus]}
                            </span>
                        </div>
                    </div>

                    <div className="order-dialog__grid">
                        <section className="order-dialog__card" aria-labelledby="order-dialog-customer">
                            <h3 id="order-dialog-customer">Người nhận</h3>
                            <dl className="order-dialog__info">
                                <div><dt>Họ tên</dt><dd>{customer.name}</dd></div>
                                <div><dt>Điện thoại</dt><dd><a href={`tel:${customer.phone}`}>{customer.phone}</a></dd></div>
                                <div><dt>Khu vực</dt><dd>{customer.region}</dd></div>
                                <div><dt>Địa chỉ</dt><dd>{customer.address}</dd></div>
                                {customer.note && <div><dt>Ghi chú</dt><dd>{customer.note}</dd></div>}
                            </dl>
                        </section>

                        <section className="order-dialog__card" aria-labelledby="order-dialog-delivery">
                            <h3 id="order-dialog-delivery">Thanh toán và giao hàng</h3>
                            <dl className="order-dialog__info">
                                <div><dt>Trả tiền</dt><dd>{paymentName}</dd></div>
                                <div><dt>Cách giao</dt><dd>{shippingName}</dd></div>
                                {estimatedDays && <div><dt>Dự kiến</dt><dd>{estimatedDays}</dd></div>}
                                <div><dt>Phí giao</dt><dd>{formatVND(order.shippingFee)}</dd></div>
                            </dl>
                        </section>
                    </div>

                    <section className="order-dialog__card" aria-labelledby="order-dialog-items">
                        <h3 id="order-dialog-items">
                            Cây trong đơn
                            <span>{order.items.length} loại · {countPlants(order.items)} cây</span>
                        </h3>
                        <ul className="order-dialog__items">
                            {order.items.map((item) => (
                                <li key={item.productId}>
                                    <div>
                                        <span className="order-dialog__item-name">{item.name}</span>
                                        <span className="order-dialog__item-qty">
                                            {formatVND(item.unitPrice)} × {item.quantity}
                                        </span>
                                    </div>
                                    <span className="order-dialog__item-total">
                                        {formatVND(item.unitPrice * item.quantity)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <dl className="order-dialog__totals">
                            <div><dt>Tiền hàng</dt><dd>{formatVND(order.subtotal)}</dd></div>
                            {order.discount ? <div><dt>Giảm giá</dt><dd>−{formatVND(order.discount)}</dd></div> : null}
                            <div><dt>Phí giao hàng</dt><dd>{formatVND(order.shippingFee)}</dd></div>
                            <div className="is-total"><dt>Tổng cộng</dt><dd>{formatVND(order.total)}</dd></div>
                        </dl>
                    </section>
                </div>

                <footer className="order-dialog__footer">
                    <button type="button" className="order-dialog__done" onClick={closeDialog}>
                        Đóng
                    </button>
                </footer>
            </div>
        </dialog>
    )
}

export default OrderDetail

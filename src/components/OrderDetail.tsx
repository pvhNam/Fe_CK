import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { DeliveryStatus, Order, PaymentCode } from '../types'
import { formatVND } from '../utils/currency'
import { DELIVERY_LABELS, PAYMENT_LABELS, countPlants, formatDateTime } from '../utils/orderDisplay'
import {
    DELIVERY_ACTION_LABELS,
    STEP_BACK_REASON_MAX,
    canCancel,
    canCollectCash,
    canEditRecipient,
    deliveryChanges,
    nextForwardStatus,
    paidChanges,
    previousStatus,
    recipientChanges,
    type OrderChanges,
} from '../utils/orderStatus'
import OrderHistory from './OrderHistory'
import OrderProgress from './OrderProgress'
import OrderRecipientForm from './OrderRecipientForm'
import '../style/ProductForm.css'

type OrderDetailProps = {
    order: Order
    paymentName: string
    paymentCode: PaymentCode | null
    shippingName: string
    onUpdate: (changes: OrderChanges) => Promise<string | null>
    onClose: () => void
}

type Message = { type: 'success' | 'error'; text: string } | null

type Panel = 'cancel' | 'back' | 'recipient' | null

const CLOSE_ANIMATION_MS = 180

function OrderDetail({ order, paymentName, paymentCode, shippingName, onUpdate, onClose }: OrderDetailProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [closing, setClosing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [panel, setPanel] = useState<Panel>(null)
    const [reason, setReason] = useState('')
    const [reasonError, setReasonError] = useState('')
    const [message, setMessage] = useState<Message>(null)
    const { customer } = order
    const estimatedDays = order.shippingMethod?.estimatedDays

    const forward = nextForwardStatus(order.deliveryStatus)
    const back = previousStatus(order)
    const cancellable = canCancel(order.deliveryStatus)
    const collectable = canCollectCash(order, paymentCode)
    const editable = canEditRecipient(order.deliveryStatus)
    const finished = !forward && !back && !cancellable && !collectable

    useEffect(() => {
        const dialog = dialogRef.current
        if (dialog && !dialog.open) dialog.showModal()
    }, [])

    function closeDialog() {
        if (closing || saving) return
        setClosing(true)
        window.setTimeout(() => dialogRef.current?.close(), CLOSE_ANIMATION_MS)
    }

    function closePanel() {
        setPanel(null)
        setMessage(null)
    }

    function openPanel(next: Panel) {
        setPanel(next)
        setMessage(null)
        setReason('')
        setReasonError('')
    }

    async function save(changes: OrderChanges, successText: string) {
        setSaving(true)
        setMessage(null)
        const error = await onUpdate(changes)
        setSaving(false)
        if (error) {
            setMessage({ type: 'error', text: `Chưa lưu được. ${error}` })
            return
        }
        setPanel(null)
        setMessage({ type: 'success', text: successText })
    }

    function moveForward(next: DeliveryStatus) {
        let text = `Đơn #${order.id} đã chuyển sang "${DELIVERY_LABELS[next]}".`
        if (next === 'delivered' && paymentCode === 'COD' && order.paymentStatus === 'unpaid') {
            text += ' Nhận đủ tiền mặt rồi thì bấm "Đã thu".'
        }
        void save(deliveryChanges(order, next), text)
    }

    function stepBack(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!back) return
        const note = reason.trim().replace(/\s+/g, ' ')
        if (!note) {
            setReasonError('Nhập lý do để lùi bước.')
            return
        }
        void save(deliveryChanges(order, back, note), `Đơn #${order.id} đã lùi về "${DELIVERY_LABELS[back]}".`)
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
                        disabled={saving}
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

                    <OrderProgress order={order} />
                    <OrderHistory history={order.statusHistory ?? []} />

                    <div className="order-dialog__grid">
                        <section
                            className={`order-dialog__card ${panel === 'recipient' ? 'is-editing' : ''}`}
                            aria-labelledby="order-dialog-customer"
                        >
                            <div className="order-dialog__card-head">
                                <h3 id="order-dialog-customer">Người nhận</h3>
                                {editable && panel === null && (
                                    <button
                                        type="button"
                                        className="order-dialog__edit"
                                        onClick={() => openPanel('recipient')}
                                        disabled={saving}
                                    >
                                        Sửa
                                    </button>
                                )}
                            </div>

                            {panel === 'recipient' ? (
                                <OrderRecipientForm
                                    customer={customer}
                                    saving={saving}
                                    onCancel={closePanel}
                                    onSave={(next) => void save(recipientChanges(next), `Đã cập nhật người nhận đơn #${order.id}.`)}
                                />
                            ) : (
                                <dl className="order-dialog__info">
                                    <div><dt>Họ tên</dt><dd>{customer.name}</dd></div>
                                    <div><dt>Điện thoại</dt><dd><a href={`tel:${customer.phone}`}>{customer.phone}</a></dd></div>
                                    <div><dt>Khu vực</dt><dd>{customer.region}</dd></div>
                                    <div><dt>Địa chỉ</dt><dd>{customer.address}</dd></div>
                                    {customer.note && <div><dt>Ghi chú</dt><dd>{customer.note}</dd></div>}
                                </dl>
                            )}
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
                    {message && (
                        <p
                            className={`order-dialog__message is-${message.type}`}
                            role={message.type === 'error' ? 'alert' : 'status'}
                        >
                            {message.text}
                        </p>
                    )}

                    {panel === 'cancel' && (
                        <div className="order-dialog__confirm">
                            <p>
                                Hủy đơn #{order.id}? Đơn đã hủy không chuyển lại được.
                                {order.paymentStatus === 'paid' && ' Đơn này đã trả tiền online, bạn có chắc muốn hủy và hoàn tiền sau đó không?'}
                            </p>
                            <div className="order-dialog__actions">
                                <button
                                    type="button"
                                    className="order-dialog__secondary"
                                    onClick={closePanel}
                                    disabled={saving}
                                >
                                    Không hủy
                                </button>
                                <button
                                    type="button"
                                    className="order-dialog__danger"
                                    onClick={() => void save(deliveryChanges(order, 'cancelled'), `Đã hủy đơn #${order.id}.`)}
                                    disabled={saving}
                                >
                                    {saving ? 'Đang lưu...' : 'Có, hủy đơn'}
                                </button>
                            </div>
                        </div>
                    )}

                    {panel === 'back' && back && (
                        <form className="order-dialog__back-form" onSubmit={stepBack} noValidate>
                            <div className="product-form__field">
                                <label htmlFor="order-back-reason">
                                    Lùi đơn #{order.id} từ "{DELIVERY_LABELS[order.deliveryStatus]}" về "{DELIVERY_LABELS[back]}". Lý do:
                                </label>
                                <textarea
                                    id="order-back-reason"
                                    rows={2}
                                    maxLength={STEP_BACK_REASON_MAX}
                                    value={reason}
                                    placeholder="Ví dụ: Đóng gói nhầm size, cần đóng gói lại"
                                    aria-invalid={Boolean(reasonError)}
                                    aria-describedby={reasonError ? 'order-back-reason-error' : undefined}
                                    disabled={saving}
                                    autoFocus
                                    onChange={(event) => {
                                        setReason(event.target.value)
                                        setReasonError('')
                                    }}
                                />
                                {reasonError && (
                                    <span className="product-form__error" id="order-back-reason-error">{reasonError}</span>
                                )}
                            </div>
                            <div className="order-dialog__actions">
                                <button
                                    type="button"
                                    className="order-dialog__secondary"
                                    onClick={closePanel}
                                    disabled={saving}
                                >
                                    Không lùi
                                </button>
                                <button type="submit" className="order-dialog__primary" disabled={saving}>
                                    {saving ? 'Đang lưu...' : 'Lùi lại'}
                                </button>
                            </div>
                        </form>
                    )}

                    {(panel === null || panel === 'recipient') && (
                        <>
                            {panel === null && (back || cancellable) && (
                                <div className="order-dialog__more">
                                    {back && (
                                        <button
                                            type="button"
                                            className="order-dialog__back"
                                            onClick={() => openPanel('back')}
                                            disabled={saving}
                                        >
                                            Lùi một bước
                                        </button>
                                    )}
                                    {cancellable && (
                                        <button
                                            type="button"
                                            className="order-dialog__cancel-order"
                                            onClick={() => openPanel('cancel')}
                                            disabled={saving}
                                        >
                                            Hủy đơn
                                        </button>
                                    )}
                                </div>
                            )}

                            {finished && (
                                <p className="order-dialog__finished">
                                    {order.deliveryStatus === 'cancelled'
                                        ? 'Đơn đã hủy, không còn thao tác.'
                                        : 'Đơn đã giao và thanh toán xong.'}
                                </p>
                            )}

                            <div className="order-dialog__actions">
                                <button
                                    type="button"
                                    className="order-dialog__secondary"
                                    onClick={closeDialog}
                                    disabled={saving}
                                >
                                    Đóng
                                </button>
                                {panel === null && forward && (
                                    <button
                                        type="button"
                                        className="order-dialog__primary"
                                        onClick={() => moveForward(forward)}
                                        disabled={saving}
                                    >
                                        {saving ? 'Đang lưu...' : DELIVERY_ACTION_LABELS[forward]}
                                    </button>
                                )}
                                {panel === null && collectable && (
                                    <button
                                        type="button"
                                        className="order-dialog__primary"
                                        onClick={() => void save(paidChanges(), `Đã ghi nhận thu ${formatVND(order.total)} tiền mặt cho đơn #${order.id}.`)}
                                        disabled={saving}
                                    >
                                        {saving ? 'Đang lưu...' : `Đã thu ${formatVND(order.total)}`}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </footer>
            </div>
        </dialog>
    )
}

export default OrderDetail
import {useEffect, useRef, useState} from 'react'
import CheckoutPaymentMethods from '../components/checkout/CheckoutPaymentMethods'
import {useApiData} from '../hooks/useApiData'
import {useCart} from '../hooks/useCart'
import {useCheckoutTotals} from '../hooks/useCheckoutTotals'
import {getShippingMethods} from '../services/checkoutService'
import type {Customer} from '../types'
import {readShippingMethodId} from '../utils/checkoutStorage'
import {formatVND} from '../utils/currency'
import {normalizeRecipient, validateRecipient} from '../utils/recipient'
import {readRecipientDraft} from '../utils/recipientStorage'
import '../style/CheckoutRecipientPage.css'

function PaymentStep({customer, shippingMethodId}: {customer: Customer; shippingMethodId: number}) {
    const {items} = useCart()
    const shipping = useApiData(getShippingMethods)
    const shippingMethod = shipping.data?.ok ? shipping.data.data.find(method => method.id === shippingMethodId) : undefined
    const {totals, error, loading, retry} = useCheckoutTotals(items, shippingMethod?.fee ?? 0)

    if (shipping.data === null) return <p role="status">Đang tải cách giao hàng…</p>
    if (!shipping.data.ok) return (
        <div className="recipient-message is-error" role="alert">
            <p>{shipping.data.message}</p>
            <button className="recipient-shipping__retry" type="button" onClick={shipping.retry}>Thử lại giao hàng</button>
        </div>
    )
    if (!shippingMethod) return <p role="alert">Cách giao hàng đã chọn không còn. <a href="/thanh-toan/giao-hang">Chọn lại cách giao hàng</a></p>
    if (loading) return <p role="status">Đang tải tiền hàng…</p>
    if (error || !totals) return (
        <div className="recipient-message is-error" role="alert">
            <p>{error ?? 'Chưa tính được tiền giỏ hàng.'}</p>
            <button className="recipient-shipping__retry" type="button" onClick={retry}>Thử lại giỏ hàng</button>
        </div>
    )

    const checkoutKey = JSON.stringify([normalizeRecipient(customer), shippingMethod.id, totals.shippingFee, totals.items])

    return (
        <>
            <dl className="recipient-shipping__totals checkout-payment__totals" aria-label="Tổng tiền và phí giao hàng">
                <div><dt>Tiền hàng</dt><dd>{formatVND(totals.subtotal)}</dd></div>
                <div><dt>Phí giao hàng</dt><dd>{formatVND(totals.shippingFee)}</dd></div>
                <div><dt>Tổng thanh toán</dt><dd>{formatVND(totals.total)}</dd></div>
            </dl>
            <CheckoutPaymentMethods key={checkoutKey} checkoutKey={checkoutKey} total={totals.total} />
        </>
    )
}

export default function CheckoutPaymentPage() {
    const {items, storageError} = useCart()
    const [draft] = useState(readRecipientDraft)
    const [shippingMethodId] = useState(readShippingMethodId)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const validRecipient = !draft.error && Object.keys(validateRecipient(draft.customer)).length === 0

    useEffect(() => {
        headingRef.current?.focus()
    }, [])

    return (
        <main className="recipient-page">
            <div className="recipient-container">
                <nav className="recipient-steps" aria-label="Các bước mua hàng">
                    <ol>
                        <li><a href="/gio-hang">Giỏ hàng</a></li>
                        <li><a href="/thanh-toan">Người nhận</a></li>
                        <li><a href="/thanh-toan/giao-hang">Giao hàng</a></li>
                        <li aria-current="step">Thanh toán</li>
                    </ol>
                </nav>
                <header className="recipient-heading">
                    <h1 ref={headingRef} tabIndex={-1}>Phương thức thanh toán</h1>
                </header>
                <section className="recipient-shipping" aria-label="Thanh toán">
                    {storageError && <p className="recipient-message is-error" role="alert">{storageError}</p>}
                    {!items.length && <p role="status">Giỏ hàng đang trống.</p>}
                    {items.length > 0 && !validRecipient && <p role="alert">Vui lòng lưu thông tin người nhận trước khi thanh toán.</p>}
                    {items.length > 0 && validRecipient && shippingMethodId === null && <p role="alert">Vui lòng chọn cách giao hàng trước khi thanh toán.</p>}
                    {items.length > 0 && validRecipient && shippingMethodId !== null && (
                        <PaymentStep customer={draft.customer} shippingMethodId={shippingMethodId} />
                    )}
                    <div className="recipient-actions">
                        <a href="/thanh-toan/giao-hang">Quay lại giao hàng</a>
                        <a href="/gio-hang">Về giỏ hàng</a>
                    </div>
                </section>
            </div>
        </main>
    )
}
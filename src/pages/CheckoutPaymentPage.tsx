import {Link} from 'react-router-dom'
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
import StatePanel from '../components/StatePanel'

function PaymentStep({customer, shippingMethodId}: { customer: Customer; shippingMethodId: number }) {
    const {items} = useCart()
    const shipping = useApiData(getShippingMethods)
    const shippingMethod = shipping.data?.ok ? shipping.data.data.find(method => method.id === shippingMethodId) : undefined
    const {totals, error, loading, retry} = useCheckoutTotals(items, shippingMethod?.fee ?? 0)

    if (shipping.data === null) return <StatePanel variant="loading">Đang tải cách giao hàng...</StatePanel>
    if (!shipping.data.ok) return (
        <StatePanel variant="error" title="Chưa tải được cách giao hàng" actionLabel="Thử lại giao hàng"
                    onAction={shipping.retry}>
            {shipping.data.message}
        </StatePanel>
    )
    if (!shippingMethod) return (
        <StatePanel variant="empty" title="Cách giao hàng đã chọn không còn" actionLabel="Chọn lại cách giao hàng"
                    actionHref="/thanh-toan/giao-hang">
            Chọn lại để tiếp tục thanh toán.
        </StatePanel>
    )
    if (loading) return <StatePanel variant="loading">Đang tải tiền hàng...</StatePanel>
    if (error || !totals) return (
        <StatePanel variant="error" title="Chưa tính được tiền giỏ hàng" actionLabel="Thử lại giỏ hàng"
                    onAction={retry}>
            {error ?? 'Kiểm tra kết nối rồi thử lại.'}
        </StatePanel>
    )

    const recipient = normalizeRecipient(customer)
    const checkoutKey = JSON.stringify([recipient, shippingMethod.id, totals.shippingFee, totals.items])

    return (
        <>
            <dl className="recipient-shipping__totals checkout-payment__totals" aria-label="Tổng tiền và phí giao hàng">
                <div>
                    <dt>Tiền hàng</dt>
                    <dd>{formatVND(totals.subtotal)}</dd>
                </div>
                <div>
                    <dt>Phí giao hàng</dt>
                    <dd>{formatVND(totals.shippingFee)}</dd>
                </div>
                <div>
                    <dt>Tổng thanh toán</dt>
                    <dd>{formatVND(totals.total)}</dd>
                </div>
            </dl>
            <CheckoutPaymentMethods key={checkoutKey} checkoutKey={checkoutKey}
                                    customer={recipient} shippingMethod={shippingMethod} totals={totals}/>
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
                        <li><Link to="/gio-hang">Giỏ hàng</Link></li>
                        <li><Link to="/thanh-toan">Người nhận</Link></li>
                        <li><Link to="/thanh-toan/giao-hang">Giao hàng</Link></li>
                        <li aria-current="step">Thanh toán</li>
                    </ol>
                </nav>
                <header className="recipient-heading">
                    <h1 ref={headingRef} tabIndex={-1}>Phương thức thanh toán</h1>
                </header>
                <section className="recipient-shipping" aria-label="Thanh toán">
                    {storageError && <p className="recipient-message is-error" role="alert">{storageError}</p>}
                    {!items.length && (
                        <StatePanel variant="empty" title="Giỏ hàng đang trống" actionLabel="Tiếp tục mua sắm"
                                    actionHref="/san-pham">
                            Thêm cây vào giỏ để thanh toán.
                        </StatePanel>
                    )}
                    {items.length > 0 && !validRecipient && (
                        <StatePanel variant="empty" title="Chưa có thông tin người nhận"
                                    actionLabel="Nhập thông tin người nhận" actionHref="/thanh-toan">
                            Vui lòng lưu thông tin người nhận trước khi thanh toán.
                        </StatePanel>
                    )}
                    {items.length > 0 && validRecipient && shippingMethodId === null && (
                        <StatePanel variant="empty" title="Chưa chọn cách giao hàng" actionLabel="Chọn cách giao hàng"
                                    actionHref="/thanh-toan/giao-hang">
                            Vui lòng chọn cách giao hàng trước khi thanh toán.
                        </StatePanel>
                    )}
                    {items.length > 0 && validRecipient && shippingMethodId !== null && (
                        <PaymentStep customer={draft.customer} shippingMethodId={shippingMethodId}/>
                    )}
                    <div className="recipient-actions">
                        <Link to="/thanh-toan/giao-hang">Quay lại giao hàng</Link>
                        <Link to="/gio-hang">Về giỏ hàng</Link>
                    </div>
                </section>
            </div>
        </main>
    )
}
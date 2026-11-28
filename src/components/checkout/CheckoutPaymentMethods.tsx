import {Link, useNavigate} from 'react-router-dom'
import {useEffect, useRef, useState} from 'react'
import type {CartTotals, Coupon, Customer, PaymentMethod, ShippingMethod} from '../../types'
import {couponDiscount} from '../../utils/coupon'
import {purchaseApi, usePaymentsData} from '../../store/purchaseApi'
import {useCart} from '../../hooks/useCart'
import {useDispatch} from 'react-redux'
import {paymentChanged, checkoutReloaded, checkoutDraft, usePurchaseSelector} from '../../store/purchaseStore'
import {clearCheckoutDrafts, writePaymentDraft} from '../../utils/checkoutStorage'
import type {OnlinePaymentResult, PaymentDraft} from '../../utils/checkoutStorage'
import {formatVND} from '../../utils/currency'
import {rememberOrder} from '../../utils/orderHistoryStorage'

type Props = {
    coupon?: Coupon
    onSubmitting: (value: boolean) => void
    checkoutKey: string
    customer: Customer
    shippingMethod: ShippingMethod
    totals: CartTotals
}

export default function CheckoutPaymentMethods({checkoutKey, customer, shippingMethod, totals, coupon, onSubmitting}: Props) {
    const navigate = useNavigate()
    const {clearCart} = useCart()
    const {data, retry} = usePaymentsData()
    const dispatch = useDispatch()
    const draft = usePurchaseSelector(state => state.checkout.payment)
    const [submitOrder] = purchaseApi.usePlaceOrderMutation()
    const [saveError, setSaveError] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [orderError, setOrderError] = useState('')
    const sending = useRef(false)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const mounted = useRef(false)
    useEffect(() => {
        mounted.current = true
        return () => {
            mounted.current = false
        }
    }, [])
    const selected = data?.ok && draft?.checkoutKey === checkoutKey
        ? data.data.find(method => method.id === draft.paymentMethodId && method.code === draft.code)
        : undefined

    function persist(next: PaymentDraft): boolean {
        try {
            writePaymentDraft(next)
        } catch {
            setSaveError(true)
            return false
        }
        dispatch(paymentChanged(next))
        setSaveError(false)
        return true
    }

    function save(method: PaymentMethod, onlineResult: OnlinePaymentResult | null = null): boolean {
        setOrderError('')
        return persist({
            checkoutKey, paymentMethodId: method.id, code: method.code, onlineResult,
            paymentStatus: onlineResult === 'success' ? 'paid' : 'unpaid',
            requestId: draft?.checkoutKey === checkoutKey ? draft.requestId : undefined,
        })
    }

    function choose(method: PaymentMethod) {
        if (save(method) && method.code === 'ONLINE_DEMO') dialogRef.current?.showModal()
    }

    function finishSimulation(result: OnlinePaymentResult) {
        if (selected?.code === 'ONLINE_DEMO') save(selected, result)
        dialogRef.current?.close()
    }

    const paid = selected?.code === 'ONLINE_DEMO' && draft?.onlineResult === 'success' && draft.paymentStatus === 'paid'
    const canPlaceOrder = selected?.code === 'COD' || paid

    async function placeOrder() {
        if (sending.current || !canPlaceOrder || !selected || !draft || draft.orderId) return
        if (coupon && !couponDiscount(coupon, totals.subtotal)) {
            setOrderError('Mã giảm giá không còn hợp lệ. Vui lòng chọn lại hoặc bỏ mã.')
            return
        }
        sending.current = true
        onSubmitting(true)
        setSubmitting(true)
        setOrderError('')
        try {
            const requestId = draft.requestId ?? crypto.getRandomValues(new Uint32Array(4)).join('-')
            const attempt = {...draft, requestId}
            if (!draft.requestId && !persist(attempt)) return
            const now = new Date().toISOString()
            const result = await submitOrder([{
                ...totals,
                customer,
                shippingMethod,
                shippingMethodId: shippingMethod.id,
                paymentMethod: selected,
                paymentMethodId: selected.id,
                paymentStatus: draft.paymentStatus,
                deliveryStatus: 'pending',
                createdAt: now,
                updatedAt: now,
                statusHistory: [{status: 'pending', at: now}],
                requestId,
                requestFingerprint: JSON.stringify([checkoutKey, selected.id]),
            }, Boolean(draft.requestId)]).unwrap()
            const historySaved = result.ok && rememberOrder(result.data.id)
            if (historySaved) dispatch(purchaseApi.util.invalidateTags(['History']))
            if (!mounted.current) return
            if (!result.ok) {
                setOrderError(result.message)
                return
            }
            const order = result.data
            const completed: PaymentDraft = {
                ...attempt, orderId: order.id, paymentMethodId: order.paymentMethodId, code: order.paymentMethod.code,
                paymentStatus: order.paymentStatus, onlineResult: order.paymentStatus === 'paid' ? 'success' : null,
            }
            if (!persist(completed)) dispatch(paymentChanged(completed))
            const query = new URLSearchParams()
            if (!historySaved) query.set('loi-lich-su', '1')
            try {
                clearCart(totals.items)
                clearCheckoutDrafts()
                dispatch(checkoutReloaded(checkoutDraft()))
            } catch {
                query.set('kiem-tra-gio', '1')
            }
            navigate({pathname: `/don-hang/${order.id}/xac-nhan`, search: query.toString()}, {replace: true})
        } catch {
            setOrderError('Chưa xác nhận được đơn hàng. Vui lòng thử lại.')
        } finally {
            sending.current = false
            onSubmitting(false)
            setSubmitting(false)
        }
    }

    if (draft?.checkoutKey === checkoutKey && draft.orderId) {
        return <p className="recipient-message is-success" role="status">
            Đặt hàng thành công. <Link to={`/don-hang/${draft.orderId}/xac-nhan`}>Xem đơn #{draft.orderId}</Link>
        </p>
    }
    if (data === null) return <p role="status">Đang tải phương thức thanh toán…</p>
    if (!data.ok) return (
        <div className="recipient-message is-error" role="alert">
            <p>{data.message}</p>
            <button className="recipient-shipping__retry" type="button" onClick={retry}>Thử lại thanh toán</button>
        </div>
    )
    if (!data.data.length) return (
        <div className="recipient-message" role="status">
            <p>Chưa có phương thức thanh toán.</p>
            <button className="recipient-shipping__retry" type="button" onClick={retry}>Tải lại thanh toán</button>
        </div>
    )

    let message = ''
    if (selected?.code === 'COD') message = 'Đã chọn COD. Chưa thanh toán.'
    if (selected?.code === 'ONLINE_DEMO') {
        if (paid) message = 'Thanh toán thành công. Đã thanh toán.'
        else if (draft?.onlineResult === 'failure') message = 'Thanh toán thất bại. Bạn có thể thử lại.'
        else if (draft?.onlineResult === 'cancelled') message = 'Đã hủy thanh toán. Bạn có thể thử lại.'
        else message = 'Chưa thanh toán.'
    }

    return (
        <>
            <fieldset className="recipient-shipping__methods" disabled={submitting}>
                <legend>Chọn phương thức thanh toán</legend>
                {data.data.map(method => (
                    <label className="recipient-shipping__method" key={method.id}>
                        <input type="radio" name="paymentMethod" value={method.id}
                               checked={selected?.id === method.id} onChange={() => choose(method)}/>
                        <strong>{method.name}</strong>
                    </label>
                ))}
            </fieldset>
            {message && <p className={`recipient-message${paid ? ' is-success' : ''}`} role="status">{message}</p>}
            {saveError &&
                <p className="recipient-message is-error" role="alert">Không lưu được lựa chọn thanh toán. Vui lòng thử
                    lại.</p>}
            {selected?.code === 'ONLINE_DEMO' && !paid && (
                <button className="recipient-shipping__retry" type="button" onClick={() => choose(selected)}>Thanh toán lại</button>
            )}
            {orderError && <p className="recipient-message is-error" role="alert">{orderError}</p>}
            <div className="recipient-actions">
                <button type="button" onClick={placeOrder} disabled={!canPlaceOrder || submitting}
                        aria-busy={submitting}>
                    {submitting ? 'Đang gửi đơn…' : 'Đặt hàng'}
                </button>
            </div>
            <dialog ref={dialogRef} className="checkout-payment__dialog" aria-labelledby="payment-demo-title"
                    onCancel={event => {
                        event.preventDefault()
                        finishSimulation('cancelled')
                    }}>
                <h2 id="payment-demo-title">Thanh toán online</h2>
                <p>Tổng thanh toán <strong>{formatVND(totals.total)}</strong></p>
                <div className="recipient-actions checkout-payment__dialog-actions">
                    <button type="button" onClick={() => finishSimulation('success')}>Thành công</button>
                    <button type="button" onClick={() => finishSimulation('failure')}>Thất bại</button>
                    <button type="button" onClick={() => finishSimulation('cancelled')}>Hủy</button>
                </div>
            </dialog>
        </>
    )
}
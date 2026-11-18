import {useRef, useState} from 'react'
import type {PaymentMethod} from '../../types'
import {useApiData} from '../../hooks/useApiData'
import {getPaymentMethods} from '../../services/checkoutService'
import {readPaymentDraft, writePaymentDraft} from '../../utils/checkoutStorage'
import type {OnlinePaymentResult, PaymentDraft} from '../../utils/checkoutStorage'
import {formatVND} from '../../utils/currency'

export default function CheckoutPaymentMethods({checkoutKey, total}: {checkoutKey: string; total: number}) {
    const {data, retry} = useApiData(getPaymentMethods)
    const [draft, setDraft] = useState(readPaymentDraft)
    const [saveError, setSaveError] = useState(false)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const selected = data?.ok && draft?.checkoutKey === checkoutKey
        ? data.data.find(method => method.id === draft.paymentMethodId && method.code === draft.code)
        : undefined

    function save(method: PaymentMethod, onlineResult: OnlinePaymentResult | null = null): boolean {
        const next: PaymentDraft = {
            checkoutKey,
            paymentMethodId: method.id,
            code: method.code,
            paymentStatus: onlineResult === 'success' ? 'paid' : 'unpaid',
            onlineResult,
        }
        try {
            writePaymentDraft(next)
        } catch {
            setSaveError(true)
            return false
        }
        setDraft(next)
        setSaveError(false)
        return true
    }

    function choose(method: PaymentMethod) {
        if (save(method) && method.code === 'ONLINE_DEMO') dialogRef.current?.showModal()
    }

    function finishSimulation(result: OnlinePaymentResult) {
        if (selected?.code === 'ONLINE_DEMO') save(selected, result)
        dialogRef.current?.close()
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

    const paid = selected?.code === 'ONLINE_DEMO' && draft?.paymentStatus === 'paid'
    let message = ''
    if (selected?.code === 'COD') message = 'Đã chọn COD. Chưa thanh toán.'
    if (selected?.code === 'ONLINE_DEMO') {
        if (paid) message = 'Thanh toán mô phỏng thành công. Đã thanh toán.'
        else if (draft?.onlineResult === 'failure') message = 'Thanh toán mô phỏng thất bại. Bạn có thể thử lại.'
        else if (draft?.onlineResult === 'cancelled') message = 'Đã hủy thanh toán mô phỏng. Bạn có thể thử lại.'
        else message = 'Chưa thanh toán.'
    }

    return (
        <>
            <fieldset className="recipient-shipping__methods">
                <legend>Chọn phương thức thanh toán</legend>
                {data.data.map(method => (
                    <label className="recipient-shipping__method" key={method.id}>
                        <input type="radio" name="paymentMethod" value={method.id}
                            checked={selected?.id === method.id} onChange={() => choose(method)} />
                        <strong>{method.name}</strong>
                    </label>
                ))}
            </fieldset>
            {message && <p className={`recipient-message${paid ? ' is-success' : ''}`} role="status">{message}</p>}
            {saveError && <p className="recipient-message is-error" role="alert">Không lưu được lựa chọn thanh toán. Vui lòng thử lại.</p>}
            {selected?.code === 'ONLINE_DEMO' && !paid && (
                <button className="recipient-shipping__retry" type="button" onClick={() => choose(selected)}>Mô phỏng lại thanh toán</button>
            )}
            <dialog ref={dialogRef} className="checkout-payment__dialog" aria-labelledby="payment-demo-title"
                onCancel={event => {
                    event.preventDefault()
                    finishSimulation('cancelled')
                }}>
                <h2 id="payment-demo-title">Thanh toán online mô phỏng</h2>
                <p>Tổng thanh toán <strong>{formatVND(total)}</strong></p>
                <div className="recipient-actions checkout-payment__dialog-actions">
                    <button type="button" onClick={() => finishSimulation('success')}>Thành công</button>
                    <button type="button" onClick={() => finishSimulation('failure')}>Thất bại</button>
                    <button type="button" onClick={() => finishSimulation('cancelled')}>Hủy</button>
                </div>
            </dialog>
        </>
    )
}
import {useState} from 'react'
import {useCart} from '../../hooks/useCart'
import {useApiData} from '../../hooks/useApiData'
import {getShippingMethods} from '../../services/checkoutService'
import {useCheckoutTotals} from '../../hooks/useCheckoutTotals'
import {readShippingMethodId, writeShippingMethodId} from '../../utils/checkoutStorage'
import {formatVND} from '../../utils/currency'
import StatePanel from '../../components/StatePanel'

export default function ShippingMethodSelector() {
    const {items, storageError} = useCart()
    const shipping = useApiData(getShippingMethods)
    const [selectedId, setSelectedId] = useState(readShippingMethodId)
    const [saveError, setSaveError] = useState(false)
    const methods = shipping.data?.ok ? shipping.data.data : []
    const selected = methods.find(method => method.id === selectedId)

    const {totals, error: totalsError, loading, retry} = useCheckoutTotals(items, selected?.fee ?? 0)

    function continueToPayment() {
        if (!selected || !totals?.items.length) return
        try {
            writeShippingMethodId(selected.id)
        } catch {
            setSaveError(true)
            return
        }
        window.location.assign('/thanh-toan/phuong-thuc-thanh-toan')
    }

    return (
        <section className="recipient-shipping" aria-labelledby="shipping-title">
            {storageError && <p className="recipient-message is-error" role="alert">{storageError}</p>}
            {!items.length ? (
                <StatePanel variant="empty" title="Giỏ hàng đang trống" actionLabel="Tiếp tục mua sắm" actionHref="/san-pham">
                    Thêm cây vào giỏ để chọn cách giao hàng.
                </StatePanel>
            ) : (
                <>
                    {shipping.data === null && <StatePanel variant="loading">Đang tải phương thức giao hàng...</StatePanel>}
                    {shipping.data && !shipping.data.ok && (
                        <StatePanel variant="error" title="Chưa tải được cách giao hàng" actionLabel="Thử lại giao hàng" onAction={shipping.retry}>
                            {shipping.data.message}
                        </StatePanel>
                    )}
                    {shipping.data?.ok && !methods.length && (
                        <StatePanel variant="empty" title="Chưa có phương thức giao hàng" actionLabel="Tải lại giao hàng" onAction={shipping.retry}>
                            Cửa hàng chưa cấu hình cách giao hàng.
                        </StatePanel>
                    )}
                    {methods.length > 0 && (
                        <fieldset className="recipient-shipping__methods">
                            <legend>Phương thức giao hàng</legend>
                            {methods.map(method => (
                                <label className="recipient-shipping__method" key={method.id}>
                                    <input type="radio" name="shippingMethod" value={method.id}
                                        checked={selected?.id === method.id} onChange={() => setSelectedId(method.id)} />
                                    <span><strong>{method.name}</strong><span>{method.estimatedDays}</span></span>
                                    <strong>{formatVND(method.fee)}</strong>
                                </label>
                            ))}
                        </fieldset>
                    )}
                    {loading && <StatePanel variant="loading">Đang tải tiền hàng...</StatePanel>}
                    {totalsError && (
                        <StatePanel variant="error" title="Chưa tính được tiền giỏ hàng" actionLabel="Thử lại giỏ hàng" onAction={retry}>
                            {totalsError}
                        </StatePanel>
                    )}
                    {totals && (
                        <dl className="recipient-shipping__totals" aria-label="Tổng tiền và phí giao hàng" aria-live="polite">
                            <div><dt>Tiền hàng</dt><dd>{formatVND(totals.subtotal)}</dd></div>
                            <div><dt>Phí giao hàng</dt><dd>{selected ? formatVND(totals.shippingFee) : 'Chưa chọn'}</dd></div>
                            <div><dt>Tổng thanh toán</dt><dd>{selected ? formatVND(totals.total) : 'Chưa chọn cách giao'}</dd></div>
                        </dl>
                    )}
                </>
            )}
            {saveError && <p className="recipient-message is-error" role="alert">Không lưu được cách giao hàng. Vui lòng thử lại.</p>}
            <div className="recipient-actions">
                <a href="/gio-hang">Quay lại giỏ hàng</a>
                {items.length > 0 && <button type="button" disabled={!selected || !totals} onClick={continueToPayment}>Tiếp tục thanh toán</button>}
            </div>
        </section>
    )
}
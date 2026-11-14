import {useState} from 'react'
import type {CartTotals} from '../../types'
import {useCart} from '../../hooks/useCart'
import {useApiData} from '../../hooks/useApiData'
import {getShippingMethods} from '../../services/checkoutService'
import {getProducts} from '../../services/productService'
import {calculateCartTotals} from '../../utils/cart'
import {formatVND} from '../../utils/currency'

export default function ShippingMethodSelector() {
    const {items, storageError} = useCart()
    const shipping = useApiData(getShippingMethods)
    const products = useApiData(getProducts)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const methods = shipping.data?.ok ? shipping.data.data : []
    const selected = methods.find(method => method.id === selectedId)

    let totals: CartTotals | null = null
    let totalsError: string | null = products.data && !products.data.ok ? products.data.message : null
    if (products.data?.ok) {
        try {
            if (!Array.isArray(products.data.data)) throw new TypeError('Dữ liệu sản phẩm không hợp lệ.')
            totals = calculateCartTotals(items, products.data.data.filter(product => product?.active === true), selected?.fee ?? 0)
        } catch (error) {
            totalsError = error instanceof Error ? error.message : 'Chưa tính được tiền giỏ hàng.'
        }
    }

    return (
        <section className="recipient-shipping" aria-labelledby="shipping-title">
            {storageError && <p className="recipient-message is-error" role="alert">{storageError}</p>}
            {!items.length ? <p role="status">Giỏ hàng đang trống.</p> : (
                <>
                    {shipping.data === null && <p role="status">Đang tải phương thức giao hàng…</p>}
                    {shipping.data && !shipping.data.ok && (
                        <div className="recipient-message is-error" role="alert">
                            <p>{shipping.data.message}</p>
                            <button className="recipient-shipping__retry" type="button" onClick={shipping.retry}>Thử lại giao hàng</button>
                        </div>
                    )}
                    {shipping.data?.ok && !methods.length && (
                        <div className="recipient-message" role="status">
                            <p>Chưa có phương thức giao hàng.</p>
                            <button className="recipient-shipping__retry" type="button" onClick={shipping.retry}>Tải lại giao hàng</button>
                        </div>
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
                    {products.data === null && <p role="status">Đang tải tiền hàng…</p>}
                    {totalsError && (
                        <div className="recipient-message is-error" role="alert">
                            <p>{totalsError}</p>
                            <button className="recipient-shipping__retry" type="button" onClick={products.retry}>Thử lại giỏ hàng</button>
                        </div>
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
            <a href="/gio-hang">Quay lại giỏ hàng</a>
        </section>
    )
}
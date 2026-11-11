import {useState} from 'react'
import {useApiData} from '../hooks/useApiData'
import {useCart} from '../hooks/useCart'
import {getProducts} from '../services/productService'
import type {CartItem, Product} from '../types'
import {calculateCartTotals, calculateItemTotal} from '../utils/cart'
import {formatVND} from '../utils/currency'
import '../style/CartPage.css'

function CartRow({item, product, catalogReady}: {
    item: Readonly<CartItem>
    product: Product | undefined
    catalogReady: boolean
}) {
    const {setQuantity, increaseQuantity, decreaseQuantity, removeItem} = useCart()
    const [draft, setDraft] = useState<string | null>(null)
    const [error, setError] = useState('')
    const name = product?.name ?? `Cây #${item.productId}`
    const canEdit = Boolean(product?.active && product.stock > 0)
    const errorId = `cart-error-${item.productId}`
    let lineTotal: number | null = null
    let availabilityMessage = ''

    if (catalogReady && !product?.active) {
        availabilityMessage = 'Cây này hiện không còn bán'
    } else if (product) {
        try {
            lineTotal = calculateItemTotal(product, item.quantity)
        } catch (error) {
            availabilityMessage = error instanceof Error ? error.message : 'Chưa tính được thành tiền.'
        }
    }

    function update(action: () => void) {
        try {
            action()
            setError('')
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Chưa cập nhật được giỏ hàng.')
        }
        setDraft(null)
    }

    function commitQuantity() {
        if (product && draft !== null) {
            update(() => setQuantity(product, Number(draft)))
        }
    }

    return (
        <li className="cart-row">
            <div className="cart-row__product">
                {product && <img src={product.imageUrl} alt={name} width={88} height={88}/>}
                <div>
                    {product?.active ? <a href={`/san-pham/${product.id}`}>{name}</a> : <strong>{name}</strong>}
                    {product && <p>Còn {product.stock} cây</p>}
                </div>
            </div>
            <div className="cart-row__price">
                <span className="cart-row__label">Đơn giá</span>
                {product ? formatVND(product.price) : '—'}
            </div>
            <div className="cart-row__quantity">
                <span className="cart-row__label">Số lượng</span>
                <div className="cart-quantity">
                    <button
                        type="button"
                        aria-label={`Giảm số lượng ${name}`}
                        disabled={!canEdit || item.quantity <= 1}
                        onClick={() => update(() => {
                            if (!product) return
                            if (item.quantity > product.stock) setQuantity(product, product.stock)
                            else decreaseQuantity(product)
                        })}
                    >−
                    </button>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={product?.stock}
                        step={1}
                        aria-label={`Số lượng ${name}`}
                        aria-invalid={Boolean(error || availabilityMessage)}
                        aria-describedby={error || availabilityMessage ? errorId : undefined}
                        disabled={!canEdit}
                        value={draft ?? item.quantity}
                        onChange={event => setDraft(event.target.value)}
                        onBlur={commitQuantity}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault()
                                commitQuantity()
                            }
                            if (event.key === 'Escape') {
                                setDraft(null)
                                setError('')
                            }
                        }}
                    />
                    <button
                        type="button"
                        aria-label={`Tăng số lượng ${name}`}
                        disabled={!canEdit || item.quantity >= (product?.stock ?? 0)}
                        onClick={() => update(() => {
                            if (product) increaseQuantity(product)
                        })}
                    >+
                    </button>
                </div>
            </div>
            <div className="cart-row__total">
                <span className="cart-row__label">Thành tiền</span>
                <strong>{lineTotal === null ? '—' : formatVND(lineTotal)}</strong>
            </div>
            <button
                className="cart-row__remove"
                type="button"
                aria-label={`Xóa ${name} khỏi giỏ hàng`}
                onClick={() => update(() => removeItem(item.productId))}
            >Xóa
            </button>
            {(error || availabilityMessage) && (
                <p className="cart-error cart-row__error" id={errorId} role="alert">
                    {error || availabilityMessage}
                </p>
            )}
        </li>
    )
}

function CartContents() {
    const {items} = useCart()
    const {data: result, retry} = useApiData(getProducts)
    const products = result?.ok && Array.isArray(result.data) ? result.data : []
    const productById = new Map(products.map(product => [product.id, product]))
    let loadError = ''
    let totalError = ''
    let total: number | null = null

    if (result && !result.ok) loadError = result.message
    if (result?.ok && !Array.isArray(result.data)) loadError = 'Sai định dạng'
    const catalogReady = result !== null && !loadError

    if (catalogReady) {
        try {
            if (items.some(item => !productById.get(item.productId)?.active)) {
                throw new Error('Hãy xóa cây không còn bán để cập nhật tổng tiền.')
            }
            total = calculateCartTotals(items, products).subtotal
        } catch (error) {
            totalError = error instanceof Error ? error.message : 'Chưa tính được tổng tiền.'
        }
    }

    return (
        <>
            {result === null && <p className="cart-message" role="status">Đang tải thông tin cây...</p>}
            {loadError && (
                <div className="cart-message cart-error" role="alert">
                    <p>{loadError}</p>
                    <button className="cart-button" type="button" onClick={retry}>Thử lại</button>
                </div>
            )}
            <div className="cart-layout">
                <div>
                    <div className="cart-columns" aria-hidden="true">
                        <span>Sản phẩm</span><span>Đơn giá</span><span>Số lượng</span><span>Thành tiền</span><span/>
                    </div>
                    <ul className="cart-items" aria-label="Cây trong giỏ hàng">
                        {items.map(item => (
                            <CartRow key={item.productId} item={item} product={productById.get(item.productId)}
                                     catalogReady={catalogReady}/>
                        ))}
                    </ul>
                </div>
                <aside className="cart-summary" aria-labelledby="cart-summary-title">
                    <h2 id="cart-summary-title">Tổng giỏ hàng</h2>
                    <div className="cart-summary__total" aria-live="polite" aria-atomic="true">
                        <span>Tổng tiền hàng</span>
                        <strong>{total === null ? '—' : formatVND(total)}</strong>
                    </div>
                    {totalError && <p className="cart-error" role="alert">{totalError}</p>}
                    <p>Phí vận chuyển được tính ở bước chọn giao hàng.</p>
                    <a className="cart-button" href="/san-pham">Tiếp tục mua sắm</a>
                </aside>
            </div>
        </>
    )
}

export default function CartPage() {
    const {items, itemCount, storageError} = useCart()

    return (
        <main className="cart-page">
            <div className="cart-container">
                <a className="cart-back" href="/san-pham">← Tiếp tục mua sắm</a>
                <header className="cart-heading">
                    <h1>Giỏ hàng của bạn</h1>
                    <p aria-live="polite">{itemCount} cây trong giỏ</p>
                </header>
                {storageError && <p className="cart-message cart-error" role="alert">{storageError}</p>}
                {items.length === 0 ? (
                    <section className="cart-empty">
                        <h2>Giỏ hàng đang trống</h2>
                        <p>Chọn những cây giống yêu thích để bắt đầu khu vườn của bạn.</p>
                        <p>Tổng tiền hàng <strong>{formatVND(0)}</strong></p>
                        <a className="cart-button" href="/san-pham">Tiếp tục mua sắm</a>
                    </section>
                ) : <CartContents/>}
            </div>
        </main>
    )
}
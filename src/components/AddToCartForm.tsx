import { useState } from 'react'
import type { Product } from '../types'
import { useCart } from '../hooks/useCart'
import QuantityInput from './QuantityInput'
import '../style/AddToCartForm.css'

function AddToCartForm({ product }: { product: Product }) {
    const { items, addItem } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const inCart = items.find((item) => item.productId === product.id)?.quantity ?? 0
    const remaining = Math.max(product.stock - inCart, 0)
    const selected = Math.min(quantity, Math.max(remaining, 1))

    function handleAdd() {
        try {
            addItem(product, selected)
            setMessage(`Đã thêm ${selected} cây vào giỏ hàng.`)
            setError('')
            setQuantity(1)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Chưa thêm được vào giỏ hàng.')
            setMessage('')
        }
    }

    if (product.stock <= 0) {
        return <p className="add-to-cart__note is-error">Cây này tạm hết hàng, bạn quay lại sau nhé.</p>
    }

    return (
        <div className="add-to-cart">
            <div className="add-to-cart__row">
                <QuantityInput
                    value={selected}
                    max={remaining}
                    onChange={setQuantity}
                    disabled={remaining === 0}
                />
                <button
                    type="button"
                    className="add-to-cart__button"
                    onClick={handleAdd}
                    disabled={remaining === 0}
                >
                    Thêm vào giỏ
                </button>
            </div>

            {inCart > 0 && (
                <p className="add-to-cart__note">
                    Trong giỏ đã có {inCart} cây
                    {remaining === 0 ? ', bằng số cây còn lại của vườn.' : '.'}
                </p>
            )}

            {message && (
                <p className="add-to-cart__note is-success" role="status">
                    {message} <a href="/gio-hang">Xem giỏ hàng →</a>
                </p>
            )}

            {error && (
                <p className="add-to-cart__note is-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    )
}

export default AddToCartForm
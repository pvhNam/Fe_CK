import {Link, Navigate} from 'react-router-dom'
import {useEffect, useRef} from 'react'
import ShippingMethodSelector from '../components/checkout/ShippingMethodSelector'
import {usePurchaseSelector} from '../store/purchaseStore'
import {validateRecipient} from '../utils/recipient'
import '../style/CheckoutRecipientPage.css'

export default function CheckoutShippingPage() {
    const draft = usePurchaseSelector(state => state.checkout.recipient)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const validRecipient = !draft.error && Object.keys(validateRecipient(draft.customer)).length === 0

    useEffect(() => {
        if (validRecipient) headingRef.current?.focus()
    }, [validRecipient])

    if (!validRecipient) return <Navigate to="/thanh-toan" replace/>

    return (
        <main className="recipient-page">
            <div className="recipient-container">
                <nav className="recipient-steps" aria-label="Các bước mua hàng">
                    <ol>
                        <li><Link to="/gio-hang">Giỏ hàng</Link></li>
                        <li><Link to="/thanh-toan">Người nhận</Link></li>
                        <li aria-current="step">Giao hàng</li>
                        <li>Thanh toán</li>
                    </ol>
                </nav>
                <header className="recipient-heading">
                    <h1 id="shipping-title" ref={headingRef} tabIndex={-1}>Chọn cách giao hàng</h1>
                </header>
                <ShippingMethodSelector/>
            </div>
        </main>
    )
}

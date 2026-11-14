import {useEffect, useRef, useState} from 'react'
import ShippingMethodSelector from '../components/checkout/ShippingMethodSelector'
import {readRecipientDraft} from '../utils/recipientStorage'
import {validateRecipient} from '../utils/recipient'
import '../style/CheckoutRecipientPage.css'

export default function CheckoutShippingPage() {
    const [draft] = useState(readRecipientDraft)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const validRecipient = !draft.error && Object.keys(validateRecipient(draft.customer)).length === 0

    useEffect(() => {
        if (!validRecipient) {
            window.location.replace('/thanh-toan')
            return
        }
        headingRef.current?.focus()
    }, [validRecipient])

    if (!validRecipient) return null

    return (
        <main className="recipient-page">
            <div className="recipient-container">
                <nav className="recipient-steps" aria-label="Các bước mua hàng">
                    <ol>
                        <li><a href="/gio-hang">Giỏ hàng</a></li>
                        <li><a href="/thanh-toan">Người nhận</a></li>
                        <li aria-current="step">Giao hàng</li>
                    </ol>
                </nav>
                <header className="recipient-heading">
                    <h1 id="shipping-title" ref={headingRef} tabIndex={-1}>Chọn cách giao hàng</h1>
                </header>
                <ShippingMethodSelector />
            </div>
        </main>
    )
}
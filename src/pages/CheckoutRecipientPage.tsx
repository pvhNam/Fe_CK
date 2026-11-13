import {useState} from 'react'
import type {FormEvent} from 'react'
import type {Customer} from '../types'
import {normalizeRecipient, RECIPIENT_LIMITS, validateRecipient} from '../utils/recipient'
import type {RecipientErrors, RecipientField} from '../utils/recipient'
import {readRecipientDraft, writeRecipientDraft} from '../utils/recipientStorage'
import '../style/CheckoutRecipientPage.css'

export default function CheckoutRecipientPage() {
    const [initial] = useState(readRecipientDraft)
    const [customer, setCustomer] = useState<Customer>(initial.customer)
    const [errors, setErrors] = useState<RecipientErrors>({})
    const [storageError, setStorageError] = useState(initial.error)
    const [saved, setSaved] = useState(false)

    function updateField(field: RecipientField, value: string) {
        const next = {...customer, [field]: value}
        setCustomer(next)
        setSaved(false)
        if (errors[field]) {
            const message = validateRecipient(next)[field]
            setErrors(current => ({...current, [field]: message}))
        }

        try {
            writeRecipientDraft(next)
            setStorageError(null)
        } catch (error) {
            setStorageError(error instanceof Error ? error.message : 'Chưa lưu được thông tin người nhận.')
        }
    }

    function validateField(field: RecipientField) {
        const message = validateRecipient(customer)[field]
        setErrors(current => ({...current, [field]: message}))
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSaved(false)
        const normalized = normalizeRecipient(customer)
        const validation = validateRecipient(normalized)
        setErrors(validation)
        const firstInvalidField = (Object.keys(validation) as RecipientField[])[0]

        if (firstInvalidField) {
            const input = event.currentTarget.elements.namedItem(firstInvalidField)
            if (input instanceof HTMLElement) input.focus()
            return
        }

        try {
            writeRecipientDraft(normalized)
            setCustomer(normalized)
            setStorageError(null)
            setSaved(true)
        } catch (error) {
            setStorageError(error instanceof Error ? error.message : 'Chưa lưu được thông tin người nhận.')
        }
    }

    return (
        <main className="recipient-page">
            <div className="recipient-container">
                <nav className="recipient-steps" aria-label="Các bước mua hàng">
                    <ol>
                        <li><a href="/gio-hang">Giỏ hàng</a></li>
                        <li aria-current="step">Người nhận</li>
                    </ol>
                </nav>
                <header className="recipient-heading">
                    <h1>Thông tin người nhận</h1>
                </header>

                {storageError && <p className="recipient-message is-error" role="alert">{storageError}</p>}

                <form className="recipient-form" aria-label="Thông tin người nhận" noValidate onSubmit={handleSubmit}>
                    <div className="recipient-fields">
                        <div className="recipient-field">
                            <label htmlFor="recipient-name">Họ tên người nhận <span aria-hidden="true">*</span></label>
                            <input
                                id="recipient-name"
                                name="name"
                                autoComplete="name"
                                required
                                maxLength={RECIPIENT_LIMITS.name}
                                value={customer.name}
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={errors.name ? 'recipient-name-error' : undefined}
                                onChange={event => updateField('name', event.target.value)}
                                onBlur={() => validateField('name')}
                            />
                            {errors.name && <p className="recipient-field-error" id="recipient-name-error" role="alert">{errors.name}</p>}
                        </div>
                        <div className="recipient-field">
                            <label htmlFor="recipient-phone">Số điện thoại <span aria-hidden="true">*</span></label>
                            <input
                                id="recipient-phone"
                                name="phone"
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel-national"
                                required
                                maxLength={RECIPIENT_LIMITS.phone}
                                value={customer.phone}
                                aria-invalid={Boolean(errors.phone)}
                                aria-describedby={errors.phone ? 'recipient-phone-error' : undefined}
                                onChange={event => updateField('phone', event.target.value)}
                                onBlur={() => validateField('phone')}
                            />
                            {errors.phone && <p className="recipient-field-error" id="recipient-phone-error" role="alert">{errors.phone}</p>}
                        </div>
                        <div className="recipient-field recipient-field--wide">
                            <label htmlFor="recipient-region">Khu vực (tỉnh/thành phố) <span aria-hidden="true">*</span></label>
                            <input
                                id="recipient-region"
                                name="region"
                                autoComplete="address-level1"
                                required
                                maxLength={RECIPIENT_LIMITS.region}
                                value={customer.region}
                                aria-invalid={Boolean(errors.region)}
                                aria-describedby={errors.region ? 'recipient-region-error' : undefined}
                                onChange={event => updateField('region', event.target.value)}
                                onBlur={() => validateField('region')}
                            />
                            {errors.region && <p className="recipient-field-error" id="recipient-region-error" role="alert">{errors.region}</p>}
                        </div>
                        <div className="recipient-field recipient-field--wide">
                            <label htmlFor="recipient-address">Địa chỉ chi tiết <span aria-hidden="true">*</span></label>
                            <textarea
                                id="recipient-address"
                                name="address"
                                autoComplete="street-address"
                                required
                                rows={3}
                                maxLength={RECIPIENT_LIMITS.address}
                                value={customer.address}
                                aria-invalid={Boolean(errors.address)}
                                aria-describedby={errors.address ? 'recipient-address-error' : undefined}
                                onChange={event => updateField('address', event.target.value)}
                                onBlur={() => validateField('address')}
                            />
                            {errors.address && <p className="recipient-field-error" id="recipient-address-error" role="alert">{errors.address}</p>}
                        </div>
                        <div className="recipient-field recipient-field--wide">
                            <label htmlFor="recipient-note">Ghi chú (không bắt buộc)</label>
                            <textarea
                                id="recipient-note"
                                name="note"
                                rows={3}
                                maxLength={RECIPIENT_LIMITS.note}
                                value={customer.note ?? ''}
                                aria-invalid={Boolean(errors.note)}
                                aria-describedby={errors.note ? 'recipient-note-error' : undefined}
                                onChange={event => updateField('note', event.target.value)}
                                onBlur={() => validateField('note')}
                            />
                            {errors.note && <p className="recipient-field-error" id="recipient-note-error" role="alert">{errors.note}</p>}
                        </div>
                    </div>

                    {saved && (
                        <p className="recipient-message is-success" role="status">
                            Đã lưu thông tin người nhận
                        </p>
                    )}
                    <div className="recipient-actions">
                        <a href="/gio-hang">← Quay lại giỏ hàng</a>
                        <button type="submit">Lưu thông tin người nhận</button>
                    </div>
                </form>
            </div>
        </main>
    )
}
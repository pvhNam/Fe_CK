import { useState, type FormEvent } from 'react'
import type { Customer } from '../types'
import {
    RECIPIENT_LIMITS,
    normalizeRecipient,
    validateRecipient,
    type RecipientErrors,
    type RecipientField,
} from '../utils/recipient'
import { REGION_GROUPS, REGIONS } from '../utils/regions'
import DropdownSelect from './DropdownSelect'

type OrderRecipientFormProps = {
    customer: Customer
    saving: boolean
    onCancel: () => void
    onSave: (customer: Customer) => void
}

function OrderRecipientForm({ customer, saving, onCancel, onSave }: OrderRecipientFormProps) {
    const oldRegion = customer.region.trim()
    const [draft, setDraft] = useState<Customer>({ ...customer, region: oldRegion, note: customer.note ?? '' })
    const [errors, setErrors] = useState<RecipientErrors>({})
    const showOldRegion = oldRegion !== '' && !REGIONS.includes(oldRegion)
    const regionGroups = showOldRegion
        ? [{ label: 'Khách đã nhập', options: [oldRegion] }, ...REGION_GROUPS]
        : REGION_GROUPS

    function change(field: RecipientField, value: string) {
        setDraft((current) => ({ ...current, [field]: value }))
        if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const found = validateRecipient(draft)
        if (!draft.region) found.region = 'Vui lòng chọn tỉnh/thành phố.'
        setErrors(found)
        if (Object.keys(found).length > 0) return
        onSave(normalizeRecipient(draft))
    }

    function field(name: RecipientField, label: string, wide = false) {
        const id = `order-recipient-${name}`
        const error = errors[name]
        const props = {
            id,
            value: draft[name] ?? '',
            maxLength: RECIPIENT_LIMITS[name],
            disabled: saving,
            autoFocus: name === 'name',
            'aria-invalid': Boolean(error),
            'aria-describedby': error ? `${id}-error` : undefined,
        }

        return (
            <div className={`product-form__field ${wide ? 'is-wide' : ''}`}>
                <label htmlFor={id}>{label}</label>
                {name === 'note' || name === 'address' ? (
                    <textarea {...props} rows={2} onChange={(event) => change(name, event.target.value)} />
                ) : (
                    <input
                        {...props}
                        type={name === 'phone' ? 'tel' : 'text'}
                        onChange={(event) => change(name, event.target.value)}
                    />
                )}
                {error && <span className="product-form__error" id={`${id}-error`}>{error}</span>}
            </div>
        )
    }

    return (
        <form className="order-recipient-form" onSubmit={submit} noValidate>
            <div className="order-recipient-form__grid">
                {field('name', 'Họ tên')}
                {field('phone', 'Điện thoại')}

                <div className="product-form__field is-wide">
                    <label id="order-recipient-region-label" htmlFor="order-recipient-region">Khu vực</label>
                    <DropdownSelect
                        id="order-recipient-region"
                        labelId="order-recipient-region-label"
                        value={draft.region}
                        groups={regionGroups}
                        placeholder="Chọn tỉnh/thành phố"
                        invalid={Boolean(errors.region)}
                        describedBy={errors.region ? 'order-recipient-region-error' : undefined}
                        disabled={saving}
                        onChange={(value) => change('region', value)}
                    />
                    {errors.region && (
                        <span className="product-form__error" id="order-recipient-region-error">{errors.region}</span>
                    )}
                </div>

                {field('address', 'Địa chỉ', true)}
                {field('note', 'Ghi chú', true)}
            </div>
            <div className="order-recipient-form__actions">
                <button type="button" className="order-dialog__secondary" onClick={onCancel} disabled={saving}>
                    Hủy sửa
                </button>
                <button type="submit" className="order-dialog__primary" disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu người nhận'}
                </button>
            </div>
        </form>
    )
}

export default OrderRecipientForm
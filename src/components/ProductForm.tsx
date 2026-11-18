import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Category, NewProduct } from '../types'
import {
    BAG_SIZES,
    validateProductForm,
    type ProductFormErrors,
    type ProductFormValues,
} from '../utils/productForm'
import '../style/ProductForm.css'

type ProductFormProps = {
    title: string
    initialValues: ProductFormValues
    categories: Category[]
    takenNames: string[]
    onSave: (product: NewProduct) => Promise<string | null>
    onClose: () => void
}

const CLOSE_ANIMATION_MS = 180

function ProductForm({ title, initialValues, categories, takenNames, onSave, onClose }: ProductFormProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState<ProductFormErrors>({})
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [closing, setClosing] = useState(false)

    useEffect(() => {
        const dialog = dialogRef.current
        if (dialog && !dialog.open) dialog.showModal()
        nameRef.current?.focus()
    }, [])

    function closeDialog() {
        if (closing) return
        setClosing(true)
        window.setTimeout(() => dialogRef.current?.close(), CLOSE_ANIMATION_MS)
    }

    function update<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
        setValues((current) => ({ ...current, [field]: value }))
        setErrors((current) => ({ ...current, [field]: undefined }))
    }

    function errorProps(field: keyof ProductFormValues) {
        return errors[field]
            ? { 'aria-invalid': true, 'aria-describedby': `product-${field}-error` }
            : {}
    }

    function errorText(field: keyof ProductFormValues) {
        return errors[field] ? (
            <span className="product-form__error" id={`product-${field}-error`}>{errors[field]}</span>
        ) : null
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (saving || closing) return

        const result = validateProductForm(values, takenNames, categories.map((category) => category.id))
        setErrors(result.errors)

        if (!result.product) {
            const firstField = Object.keys(result.errors)[0]
            document.getElementById(`product-${firstField}`)?.focus()
            return
        }

        setSaving(true)
        setSaveError('')
        const error = await onSave(result.product)
        setSaving(false)
        if (error) setSaveError(error)
        else closeDialog()
    }

    return (
        <dialog
            ref={dialogRef}
            className={`product-dialog ${closing ? 'is-closing' : ''}`}
            aria-labelledby="product-form-title"
            onCancel={(event) => {
                event.preventDefault()
                if (!saving) closeDialog()
            }}
            onClose={onClose}
        >
            <form className="product-form" onSubmit={handleSubmit} noValidate>
                <header className="product-form__header">
                    <h2 id="product-form-title">{title}</h2>
                    <button
                        type="button"
                        className="product-form__close"
                        onClick={closeDialog}
                        disabled={saving}
                        aria-label="Đóng"
                    >
                        ×
                    </button>
                </header>

                <div className="product-form__body">
                    <div className="product-form__grid">
                        <label className="product-form__field is-span-2">
                            Tên cây
                            <input
                                id="product-name"
                                ref={nameRef}
                                value={values.name}
                                maxLength={80}
                                onChange={(event) => update('name', event.target.value)}
                                {...errorProps('name')}
                            />
                            {errorText('name')}
                        </label>

                        <label className="product-form__field">
                            Danh mục
                            <select
                                id="product-categoryId"
                                value={values.categoryId}
                                onChange={(event) => update('categoryId', event.target.value)}
                                {...errorProps('categoryId')}
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            {errorText('categoryId')}
                        </label>

                        <label className="product-form__field">
                            Giá (₫)
                            <input
                                id="product-price"
                                inputMode="numeric"
                                placeholder="Ví dụ: 85000"
                                value={values.price}
                                onChange={(event) => update('price', event.target.value)}
                                {...errorProps('price')}
                            />
                            {errorText('price')}
                        </label>

                        <label className="product-form__field">
                            Tồn kho mẫu (cây)
                            <input
                                id="product-stock"
                                inputMode="numeric"
                                placeholder="Ví dụ: 30"
                                value={values.stock}
                                onChange={(event) => update('stock', event.target.value)}
                                {...errorProps('stock')}
                            />
                            {errorText('stock')}
                        </label>

                        <label className="product-form__field">
                            Chiều cao (cm)
                            <input
                                id="product-heightCm"
                                inputMode="numeric"
                                placeholder="Ví dụ: 60"
                                value={values.heightCm}
                                onChange={(event) => update('heightCm', event.target.value)}
                                {...errorProps('heightCm')}
                            />
                            {errorText('heightCm')}
                        </label>

                        <label className="product-form__field">
                            Quy cách bầu
                            <select
                                id="product-bagSize"
                                value={values.bagSize}
                                onChange={(event) => update('bagSize', event.target.value as ProductFormValues['bagSize'])}
                            >
                                {BAG_SIZES.map((size) => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            <span className="product-form__hint">
                                Túi đất đựng cây con. Bầu ươm: túi lớn cho cây ăn quả, hoa. Bầu nhỏ: túi nhỏ cho rau, gia vị.
                            </span>
                        </label>

                        <label className="product-form__field is-span-2">
                            Đường dẫn ảnh
                            <input
                                id="product-imageUrl"
                                placeholder="/images/products/ten-anh.jpg"
                                value={values.imageUrl}
                                onChange={(event) => update('imageUrl', event.target.value)}
                                {...errorProps('imageUrl')}
                            />
                            {errorText('imageUrl')}
                        </label>

                        <label className="product-form__field is-wide">
                            Mô tả
                            <textarea
                                id="product-description"
                                rows={3}
                                value={values.description}
                                onChange={(event) => update('description', event.target.value)}
                                {...errorProps('description')}
                            />
                            {errorText('description')}
                        </label>

                        <label className="product-form__field is-wide">
                            Hướng dẫn chăm sóc
                            <span className="product-form__hint">
                                Viết theo mẫu: Ánh sáng: … Tưới nước: … Chăm sóc: …
                            </span>
                            <textarea
                                id="product-careGuide"
                                rows={3}
                                value={values.careGuide}
                                onChange={(event) => update('careGuide', event.target.value)}
                                {...errorProps('careGuide')}
                            />
                            {errorText('careGuide')}
                        </label>

                        <label className="product-form__check is-wide">
                            <input
                                type="checkbox"
                                checked={values.active}
                                onChange={(event) => update('active', event.target.checked)}
                            />
                            Hiển thị cho khách trên trang cửa hàng
                        </label>
                    </div>

                    {saveError && (
                        <p className="product-form__save-error" role="alert">{saveError}</p>
                    )}
                </div>

                <div className="product-form__actions">
                    <button type="button" className="product-form__cancel" onClick={closeDialog} disabled={saving}>
                        Hủy
                    </button>
                    <button type="submit" className="product-form__save" disabled={saving}>
                        {saving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </form>
        </dialog>
    )
}

export default ProductForm
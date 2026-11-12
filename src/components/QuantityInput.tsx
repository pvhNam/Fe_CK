import { useState } from 'react'
import '../style/QuantityInput.css'

type QuantityInputProps = {
    value: number
    max: number
    onChange: (value: number) => void
    disabled?: boolean
}

function QuantityInput({ value, max, onChange, disabled = false }: QuantityInputProps) {
    const [draft, setDraft] = useState<string | null>(null)

    function commit(text: string) {
        const parsed = Number.parseInt(text, 10)
        if (!Number.isNaN(parsed)) onChange(Math.min(Math.max(parsed, 1), max))
        setDraft(null)
    }

    return (
        <div className="quantity-input">
            <button
                type="button"
                onClick={() => onChange(value - 1)}
                disabled={disabled || value <= 1}
                aria-label="Giảm số lượng"
            >
                −
            </button>
            <input
                type="number"
                inputMode="numeric"
                min={1}
                max={max}
                value={draft ?? value}
                disabled={disabled}
                aria-label="Số lượng"
                onChange={(event) => setDraft(event.target.value)}
                onBlur={(event) => commit(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') commit(event.currentTarget.value)
                }}
            />
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                disabled={disabled || value >= max}
                aria-label="Tăng số lượng"
            >
                +
            </button>
        </div>
    )
}

export default QuantityInput
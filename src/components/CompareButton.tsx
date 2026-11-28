import type { Product } from '../types'
import { useCompare } from '../hooks/useCompare'
import '../style/Compare.css'

type CompareButtonProps = {
    product: Pick<Product, 'id' | 'name'>
    variant?: 'card' | 'detail'
}

function CompareButton({ product, variant = 'card' }: CompareButtonProps) {
    const { isComparing, toggleCompare } = useCompare()
    const selected = isComparing(product.id)

    return (
        <button
            type="button"
            className={`compare-button is-${variant} ${selected ? 'is-selected' : ''}`}
            aria-pressed={selected}
            aria-label={`So sánh ${product.name}`}
            onClick={() => toggleCompare(product.id)}
        >
            <span className="compare-button__box" aria-hidden="true" />
            So sánh
        </button>
    )
}

export default CompareButton

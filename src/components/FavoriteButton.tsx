import type {Product} from '../types'
import {useFavorites} from '../hooks/useFavorites'
import '../style/FavoriteButton.css'

type FavoriteButtonProps = {
    product: Pick<Product, 'id' | 'name'>
    variant?: 'card' | 'detail'
}

function FavoriteButton({product, variant = 'card'}: FavoriteButtonProps) {
    const {isFavorite, toggleFavorite} = useFavorites()
    const saved = isFavorite(product.id)
    const label = `Lưu ${product.name} vào yêu thích`

    return (
        <button
            type="button"
            className={`favorite-button is-${variant} ${saved ? 'is-saved' : ''}`}
            aria-pressed={saved}
            aria-label={variant === 'card' ? label : undefined}
            title={variant === 'card' ? (saved ? 'Bỏ khỏi yêu thích' : 'Lưu vào yêu thích') : undefined}
            onClick={() => toggleFavorite(product.id)}
        >
            <svg className="favorite-button__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                    d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.5 0 5.6 3.5 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"/>
            </svg>
            {variant === 'detail' && <span>{saved ? 'Đã lưu vào yêu thích' : 'Lưu vào yêu thích'}</span>}
        </button>
    )
}

export default FavoriteButton
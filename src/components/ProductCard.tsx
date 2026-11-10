import type { Product } from '../types'
import { formatVND } from '../utils/currency'
import '../style/ProductCard.css'

type ProductCardProps = {
    product: Product
    categoryName?: string
}

function ProductCard({ product, categoryName }: ProductCardProps) {
    const inStock = product.stock > 0

    return (
        <article className={`product-card ${inStock ? '' : 'is-sold-out'}`}>
            <div className="product-card__media">
                <img
                    className="product-card__image"
                    src={product.imageUrl}
                    alt={product.name}
                    width={400}
                    height={400}
                    loading="lazy"
                />
                <span className={`product-card__stock ${inStock ? 'is-in-stock' : 'is-out'}`}>
                    {inStock ? `Còn ${product.stock} cây` : 'Hết hàng'}
                </span>
            </div>

            <div className="product-card__body">
                {categoryName && <p className="product-card__category">{categoryName}</p>}

                <h3 className="product-card__name">
                    <a href={`/san-pham/${product.id}`}>{product.name}</a>
                </h3>

                <p className="product-card__spec">
                    {product.bagSize} · Cao khoảng {product.heightCm} cm
                </p>

                <p className="product-card__price">{formatVND(product.price)}</p>
            </div>
        </article>
    )
}

export default ProductCard
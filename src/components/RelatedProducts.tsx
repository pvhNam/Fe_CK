import { useCallback } from 'react'
import type { Product } from '../types'
import { useApiData } from '../hooks/useApiData'
import { getActiveProducts } from '../services/productService'
import { RELATED_LIMIT, pickRelatedProducts } from '../utils/relatedProducts'
import ProductCard from './ProductCard'
import ProductGridSkeleton from './ProductGridSkeleton'
import StatePanel from './StatePanel'
import '../style/RelatedProducts.css'
import { Link } from 'react-router-dom'

function RelatedProducts({ product }: { product: Product }) {
    const load = useCallback(() => getActiveProducts(product.categoryId), [product.categoryId])
    const { data: result, retry } = useApiData(load)
    const related = result?.ok ? pickRelatedProducts(result.data, product) : []

    if (result?.ok && related.length === 0) return null

    return (
        <section className="related-products" aria-labelledby="related-products-title">
            <div className="related-products__heading">
                <h2 id="related-products-title">Cây cùng danh mục</h2>
                <Link to={`/san-pham?danhMuc=${product.categoryId}`}>Xem tất cả →</Link>
            </div>

            {result === null && (
                <>
                    <p className="ui-visually-hidden" role="status">Đang tải cây cùng danh mục...</p>
                    <ProductGridSkeleton count={RELATED_LIMIT} />
                </>
            )}

            {result && !result.ok && (
                <StatePanel variant="error" title="Chưa tải được cây gợi ý" actionLabel="Thử lại" onAction={retry}>
                    {result.message}
                </StatePanel>
            )}

            {related.length > 0 && (
                <div className="product-grid">
                    {related.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default RelatedProducts
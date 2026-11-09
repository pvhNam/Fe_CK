import { useEffect, useState } from 'react'
import type { Category, Product } from '../types'
import { getCategories, getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import '../style/ProductListPage.css'

function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let ignore = false

        Promise.all([getProducts(), getCategories()]).then(([productResult, categoryResult]) => {
            if (ignore) return

            if (productResult.ok) {
                setProducts(productResult.data.filter((product) => product.active))
                setError('')
            } else {
                setError(productResult.message)
            }

            if (categoryResult.ok) setCategories(categoryResult.data)

            setLoading(false)
        })

        return () => {
            ignore = true
        }
    }, [reloadKey])

    function retry() {
        setLoading(true)
        setError('')
        setReloadKey((key) => key + 1)
    }

    const categoryNames = new Map(categories.map((category) => [category.id, category.name]))

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <h1>Cây giống</h1>
                    {!loading && !error && <p>{products.length} cây đang được bán</p>}
                </header>

                {loading && (
                    <p className="product-page__status" role="status">
                        Đang tải danh sách cây...
                    </p>
                )}

                {!loading && error && (
                    <div className="product-page__status is-error" role="alert">
                        <p>{error}</p>
                        <button type="button" onClick={retry}>
                            Thử lại
                        </button>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <p className="product-page__status">Hiện chưa có cây giống nào đang bán.</p>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                categoryName={categoryNames.get(product.categoryId)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default ProductListPage
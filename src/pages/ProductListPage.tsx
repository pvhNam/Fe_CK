import {useEffect, useState} from 'react'
import type {Category, Product} from '../types'
import {getCategories, getProducts} from '../services/productService'
import ProductCard from '../components/ProductCard'
import '../style/ProductListPage.css'

const categoryGroups = new Map([
    ['cay-an-qua', [1]],
    ['rau-gia-vi', [2, 3]],
    ['hoa-cay-canh', [4]],
])

function normalizeSearch(value: string) {
    return value.toLocaleLowerCase('vi-VN')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replaceAll('đ', 'd')
}

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
    const searchParams = new URLSearchParams(window.location.search)
    const categoryParam = searchParams.get('danhMuc')
    const query = searchParams.get('q')?.trim() ?? ''
    const categoryIds = categoryParam ? categoryGroups.get(categoryParam) ?? [Number(categoryParam)] : []
    const searchTerm = normalizeSearch(query)
    const isFiltered = categoryIds.length > 0 || query.length > 0
    const visibleProducts = products.filter((product) =>
        (categoryIds.length === 0 || categoryIds.includes(product.categoryId)) &&
        (!searchTerm || normalizeSearch(product.name).includes(searchTerm)),
    )
    const heading = categories
        .filter((category) => categoryIds.includes(category.id))
        .map((category) => category.name)
        .join(' và ') || 'Cây giống'

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <h1>{heading}</h1>
                    {!loading && !error && (
                        <p>{visibleProducts.length} cây giống{query && ` cho “${query}”`}</p>
                    )}
                    {isFiltered && (
                        <a className="product-page__back" href="/san-pham">Bỏ bộ lọc</a>
                    )}
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

                {!loading && !error && visibleProducts.length === 0 && (
                    <p className="product-page__status">
                        {isFiltered
                            ? 'Không tìm thấy cây giống phù hợp.'
                            : 'Hiện chưa có cây giống nào đang bán.'}
                    </p>
                )}

                {!loading && !error && visibleProducts.length > 0 && (
                    <div className="product-grid">
                        {visibleProducts.map((product) => (
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

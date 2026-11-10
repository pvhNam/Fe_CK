import { useEffect, useRef, useState } from 'react'
import type { Category, Product } from '../types'
import { getCategories, getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import ProductFilterBar from '../components/ProductFilterBar'
import Pagination from '../components/Pagination'
import { DEFAULT_FILTERS, filterProducts, type ProductFilterValues } from '../utils/productFilters'
import '../style/ProductListPage.css'

const PAGE_SIZE = 8

function readFiltersFromUrl(): ProductFilterValues {
    const keyword = new URLSearchParams(window.location.search).get('q') ?? ''
    return { ...DEFAULT_FILTERS, keyword }
}

function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)
    const [filters, setFilters] = useState<ProductFilterValues>(readFiltersFromUrl)
    const [page, setPage] = useState(1)

    const headingRef = useRef<HTMLHeadingElement>(null)

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

    function changeFilters(nextFilters: ProductFilterValues) {
        setFilters(nextFilters)
        setPage(1)
    }

    function resetFilters() {
        changeFilters(DEFAULT_FILTERS)
    }

    function goToPage(nextPage: number) {
        setPage(nextPage)
        headingRef.current?.scrollIntoView({ block: 'start' })
    }

    const categoryNames = new Map(categories.map((category) => [category.id, category.name]))

    const visibleProducts = filterProducts(products, filters)
    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const start = (currentPage - 1) * PAGE_SIZE
    const pageProducts = visibleProducts.slice(start, start + PAGE_SIZE)

    const ready = !loading && !error

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <h1 ref={headingRef}>Cây giống</h1>
                    {ready && visibleProducts.length > 0 && (
                        <p>
                            Hiển thị {start + 1}–{start + pageProducts.length} trong{' '}
                            {visibleProducts.length} cây
                        </p>
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

                {ready && products.length === 0 && (
                    <p className="product-page__status">Hiện chưa có cây giống nào đang bán.</p>
                )}

                {ready && products.length > 0 && (
                    <>
                        <ProductFilterBar
                            filters={filters}
                            categories={categories}
                            onChange={changeFilters}
                            onReset={resetFilters}
                        />

                        {visibleProducts.length === 0 ? (
                            <div className="product-page__status" role="status">
                                <p>Không tìm thấy cây phù hợp với bộ lọc.</p>
                                <button type="button" onClick={resetFilters}>
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="product-grid">
                                    {pageProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            categoryName={categoryNames.get(product.categoryId)}
                                        />
                                    ))}
                                </div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={goToPage}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

export default ProductListPage
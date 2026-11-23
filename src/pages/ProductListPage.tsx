import { useEffect, useRef, useState } from 'react'
import type { Category, Product } from '../types'
import { getCategories, getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import ProductFilterBar from '../components/ProductFilterBar'
import Pagination from '../components/Pagination'
import { DEFAULT_FILTERS, filterProducts, type ProductFilterValues } from '../utils/productFilters'
import '../style/ProductListPage.css'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import StatePanel from '../components/StatePanel'
const PAGE_SIZE = 8

const categoryGroups = new Map([
    ['cay-an-qua', [1]],
    ['rau-gia-vi', [2, 3]],
    ['hoa-cay-canh', [4]],
])

function readCategoryScope(): number[] {
    const param = new URLSearchParams(window.location.search).get('danhMuc')
    if (!param) return []
    return categoryGroups.get(param) ?? [Number(param)]
}

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
    const [categoryScope] = useState(readCategoryScope)
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

    const isScoped = categoryScope.length > 0
    const scopedProducts = isScoped
        ? products.filter((product) => categoryScope.includes(product.categoryId))
        : products
    const scopedCategories = isScoped
        ? categories.filter((category) => categoryScope.includes(category.id))
        : categories
    const heading = scopedCategories.length > 0 && isScoped
        ? scopedCategories.map((category) => category.name).join(' và ')
        : 'Cây giống'

    const visibleProducts = filterProducts(scopedProducts, filters)
    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const start = (currentPage - 1) * PAGE_SIZE
    const pageProducts = visibleProducts.slice(start, start + PAGE_SIZE)

    const ready = !loading && !error

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <h1 ref={headingRef}>{heading}</h1>
                    {ready && visibleProducts.length > 0 && (
                        <p>
                            Hiển thị {start + 1}–{start + pageProducts.length} trong{' '}
                            {visibleProducts.length} cây
                        </p>
                    )}
                    {isScoped && (
                        <a className="product-page__back" href="/san-pham">
                            Xem tất cả cây giống
                        </a>
                    )}
                </header>

                {loading && (
                    <>
                        <p className="ui-visually-hidden" role="status">Đang tải danh sách cây...</p>
                        <ProductGridSkeleton />
                    </>
                )}

                {!loading && error && (
                    <StatePanel variant="error" title="Chưa tải được danh sách cây" actionLabel="Thử lại" onAction={retry}>
                        {error}
                    </StatePanel>
                )}

                {ready && scopedProducts.length === 0 && (
                    <StatePanel
                        variant="empty"
                        title={isScoped ? 'Không tìm thấy cây giống phù hợp' : 'Chưa có cây giống nào đang bán'}
                        actionLabel={isScoped ? 'Xem tất cả cây giống' : undefined}
                        actionHref={isScoped ? '/san-pham' : undefined}
                    >
                        {isScoped ? 'Thử đổi từ khóa hoặc chọn danh mục khác.' : 'Cửa hàng sẽ sớm cập nhật thêm cây giống.'}
                    </StatePanel>
                )}

                {ready && scopedProducts.length > 0 && (
                    <>
                        <ProductFilterBar
                            filters={filters}
                            categories={scopedCategories}
                            onChange={changeFilters}
                            onReset={resetFilters}
                        />

                        {visibleProducts.length === 0 ? (
                            <StatePanel variant="empty" title="Không tìm thấy cây phù hợp" actionLabel="Xóa bộ lọc" onAction={resetFilters}>
                                Thử bỏ bớt điều kiện lọc để xem nhiều cây hơn.
                            </StatePanel>
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
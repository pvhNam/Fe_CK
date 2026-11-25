import {Link, useSearchParams} from 'react-router-dom'
import {useRef, useState} from 'react'
import {useApiData} from '../hooks/useApiData'
import {getCategories, getProducts} from '../services/productService'
import ProductCard from '../components/ProductCard'
import ProductFilterBar from '../components/ProductFilterBar'
import Pagination from '../components/Pagination'
import {DEFAULT_FILTERS, filterProducts, type ProductFilterValues} from '../utils/productFilters'
import '../style/ProductListPage.css'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import StatePanel from '../components/StatePanel'

const PAGE_SIZE = 8

const categoryGroups = new Map([
    ['cay-an-qua', [1]],
    ['rau-gia-vi', [2, 3]],
    ['hoa-cay-canh', [4]],
])

async function loadProductList() {
    const [products, categories] = await Promise.all([getProducts(), getCategories()])
    return {products, categories}
}

type ProductListProps = {
    searchParams: URLSearchParams
    data: Awaited<ReturnType<typeof loadProductList>> | null
    retry: () => void
}

function ProductList({searchParams, data, retry}: ProductListProps) {
    const category = searchParams.get('danhMuc')
    const categoryScope = category ? categoryGroups.get(category) ?? [Number(category)] : []
    const [filters, setFilters] = useState<ProductFilterValues>(() => ({
        ...DEFAULT_FILTERS, keyword: searchParams.get('q') ?? '',
    }))
    const [page, setPage] = useState(1)
    const headingRef = useRef<HTMLHeadingElement>(null)
    const products = data?.products.ok ? data.products.data.filter((product) => product.active) : []
    const categories = data?.categories.ok ? data.categories.data : []
    const loading = data === null
    const error = data && !data.products.ok ? data.products.message : ''

    function changeFilters(nextFilters: ProductFilterValues) {
        setFilters(nextFilters)
        setPage(1)
    }

    function resetFilters() {
        changeFilters(DEFAULT_FILTERS)
    }

    function goToPage(nextPage: number) {
        setPage(nextPage)
        headingRef.current?.scrollIntoView({block: 'start'})
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
                        <Link className="product-page__back" to="/san-pham">
                            Xem tất cả cây giống
                        </Link>
                    )}
                </header>

                {loading && (
                    <>
                        <p className="ui-visually-hidden" role="status">Đang tải danh sách cây...</p>
                        <ProductGridSkeleton/>
                    </>
                )}

                {!loading && error && (
                    <StatePanel variant="error" title="Chưa tải được danh sách cây" actionLabel="Thử lại"
                                onAction={retry}>
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
                            <StatePanel variant="empty" title="Không tìm thấy cây phù hợp" actionLabel="Xóa bộ lọc"
                                        onAction={resetFilters}>
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

export default function ProductListPage() {
    const [searchParams] = useSearchParams()
    const {data, retry} = useApiData(loadProductList)
    return <ProductList key={searchParams.toString()} searchParams={searchParams} data={data} retry={retry}/>
}

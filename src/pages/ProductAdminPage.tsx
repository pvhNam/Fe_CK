import { useRef, useState } from 'react'
import { useApiData } from '../hooks/useApiData'
import { getCategories, getProducts } from '../services/productService'
import { formatVND } from '../utils/currency'
import { DEFAULT_FILTERS, filterProducts } from '../utils/productFilters'
import Pagination from '../components/Pagination'
import '../style/ProductListPage.css'
import '../style/ProductAdminPage.css'

type StatusFilter = 'all' | 'active' | 'hidden'

const PAGE_SIZE = 6

const STATUS_LABELS: Record<StatusFilter, string> = {
    all: 'Tất cả',
    active: 'Đang hiển thị',
    hidden: 'Đã ẩn',
}

async function loadAdminData() {
    const [products, categories] = await Promise.all([getProducts(), getCategories()])
    return { products, categories }
}

function ProductAdminPage() {
    const { data, retry } = useApiData(loadAdminData)
    const [keyword, setKeyword] = useState('')
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [status, setStatus] = useState<StatusFilter>('all')
    const [page, setPage] = useState(1)
    const countRef = useRef<HTMLParagraphElement>(null)

    const products = data?.products.ok ? data.products.data : []
    const categories = data?.categories.ok ? data.categories.data : []
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]))
    const loadError = data && !data.products.ok ? data.products.message : ''
    const ready = data !== null && !loadError

    const activeCount = products.filter((product) => product.active).length
    const hiddenCount = products.length - activeCount
    const outOfStockCount = products.filter((product) => product.stock <= 0).length

    const rows = filterProducts(products, { ...DEFAULT_FILTERS, keyword, categoryId })
        .filter((product) => {
            if (status === 'active') return product.active
            if (status === 'hidden') return !product.active
            return true
        })
        .sort((a, b) => a.id - b.id)

    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const start = (currentPage - 1) * PAGE_SIZE
    const pageRows = rows.slice(start, start + PAGE_SIZE)

    const activeFilters: string[] = []
    if (keyword.trim() !== '') activeFilters.push(`tên "${keyword.trim()}"`)
    if (categoryId !== null) activeFilters.push(`danh mục "${categoryNames.get(categoryId) ?? categoryId}"`)
    if (status !== 'all') activeFilters.push(`trạng thái "${STATUS_LABELS[status]}"`)
    const isFiltering = activeFilters.length > 0

    function resetFilters() {
        setKeyword('')
        setCategoryId(null)
        setStatus('all')
        setPage(1)
    }

    function goToPage(nextPage: number) {
        setPage(nextPage)
        countRef.current?.scrollIntoView({ block: 'start' })
    }

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <h1>Quản lý cây giống</h1>
                    <p>Dữ liệu mẫu từ fake API, gồm cả cây đang ẩn.</p>
                    <a className="product-page__back" href="/quan-ly/tin-tuc">Quản lý tin tức →</a>
                </header>

                {data === null && (
                    <p className="product-page__status" role="status">Đang tải danh sách cây...</p>
                )}

                {loadError && (
                    <div className="product-page__status is-error" role="alert">
                        <p>{loadError}</p>
                        <button type="button" onClick={retry}>Thử lại</button>
                    </div>
                )}

                {ready && (
                    <>
                        <ul className="product-admin__summary">
                            <li><span>Tổng số cây</span><strong>{products.length}</strong></li>
                            <li><span>Đang hiển thị</span><strong>{activeCount}</strong></li>
                            <li><span>Đã ẩn</span><strong>{hiddenCount}</strong></li>
                            <li><span>Hết hàng</span><strong>{outOfStockCount}</strong></li>
                        </ul>

                        <div className="product-admin__toolbar">
                            <label>
                                Tìm theo tên
                                <input
                                    type="search"
                                    value={keyword}
                                    placeholder="Ví dụ: bưởi"
                                    onChange={(event) => {
                                        setKeyword(event.target.value)
                                        setPage(1)
                                    }}
                                />
                            </label>
                            <label>
                                Danh mục
                                <select
                                    value={categoryId ?? ''}
                                    onChange={(event) => {
                                        setCategoryId(event.target.value === '' ? null : Number(event.target.value))
                                        setPage(1)
                                    }}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Trạng thái
                                <select
                                    value={status}
                                    onChange={(event) => {
                                        setStatus(event.target.value as StatusFilter)
                                        setPage(1)
                                    }}
                                >
                                    <option value="all">{STATUS_LABELS.all}</option>
                                    <option value="active">{STATUS_LABELS.active}</option>
                                    <option value="hidden">{STATUS_LABELS.hidden}</option>
                                </select>
                            </label>
                            {isFiltering && (
                                <button type="button" onClick={resetFilters}>Xóa lọc</button>
                            )}
                        </div>

                        <p className="product-admin__count" role="status" ref={countRef}>
                            {rows.length === 0
                                ? `Hiển thị 0 / ${products.length} cây`
                                : `Hiển thị ${start + 1}–${start + pageRows.length} trong ${rows.length} cây`}
                        </p>

                        {rows.length === 0 ? (
                            <div className="product-page__status">
                                <p>Không có cây nào khớp cùng lúc: {activeFilters.join(', ')}.</p>
                                <button type="button" onClick={resetFilters}>Xóa lọc</button>
                            </div>
                        ) : (
                            <>
                                <div className="product-admin__table-wrap">
                                    <table className="product-admin__table">
                                        <caption>Danh sách cây giống</caption>
                                        <thead>
                                        <tr>
                                            <th scope="col">Mã</th>
                                            <th scope="col">Cây giống</th>
                                            <th scope="col">Danh mục</th>
                                            <th scope="col" className="is-number">Giá</th>
                                            <th scope="col" className="is-number">Tồn kho mẫu</th>
                                            <th scope="col">Trạng thái</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {pageRows.map((product) => (
                                            <tr key={product.id} className={product.active ? '' : 'is-hidden'}>
                                                <td>#{product.id}</td>
                                                <td>
                                                    <div className="product-admin__product">
                                                        <img src={product.imageUrl} alt="" width={48} height={48} loading="lazy" />
                                                        <span>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td>{categoryNames.get(product.categoryId) ?? `Danh mục ${product.categoryId}`}</td>
                                                <td className="is-number">{formatVND(product.price)}</td>
                                                <td className="is-number">
                                                    {product.stock > 0 ? product.stock : (
                                                        <span className="product-admin__badge is-out">Hết hàng</span>
                                                    )}
                                                </td>
                                                <td>
                                                        <span className={`product-admin__badge ${product.active ? 'is-active' : 'is-hidden'}`}>
                                                            {product.active ? STATUS_LABELS.active : STATUS_LABELS.hidden}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
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

export default ProductAdminPage

import { useEffect, useRef, useState } from 'react'
import type { Category, NewProduct, Product } from '../types'
import { createProduct, getCategories, getProducts, updateProduct } from '../services/productService'
import { formatVND } from '../utils/currency'
import { DEFAULT_FILTERS, filterProducts } from '../utils/productFilters'
import { EMPTY_PRODUCT_FORM, toFormValues } from '../utils/productForm'
import Pagination from '../components/Pagination'
import StatePanel from '../components/StatePanel'
import ProductForm from '../components/ProductForm'
import '../style/ProductListPage.css'
import '../style/ProductAdminPage.css'

type StatusFilter = 'all' | 'active' | 'hidden'

type FormState = { mode: 'add' } | { mode: 'edit'; product: Product } | null

type Notice = { type: 'success' | 'error'; text: string } | null

const PAGE_SIZE = 6

const STATUS_LABELS: Record<StatusFilter, string> = {
    all: 'Tất cả',
    active: 'Đang hiển thị',
    hidden: 'Đã ẩn',
}

function ProductAdminPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    const [keyword, setKeyword] = useState('')
    const [categoryId, setCategoryId] = useState<number | null>(null)
    const [status, setStatus] = useState<StatusFilter>('all')
    const [page, setPage] = useState(1)
    const countRef = useRef<HTMLParagraphElement>(null)

    const [form, setForm] = useState<FormState>(null)
    const [notice, setNotice] = useState<Notice>(null)
    const [busyId, setBusyId] = useState<number | null>(null)
    const [savedId, setSavedId] = useState<number | null>(null)

    useEffect(() => {
        let ignore = false

        Promise.all([getProducts(), getCategories()]).then(([productResult, categoryResult]) => {
            if (ignore) return

            if (productResult.ok) {
                setProducts(productResult.data)
                setLoadError('')
            } else {
                setLoadError(productResult.message)
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
        setLoadError('')
        setReloadKey((key) => key + 1)
    }

    const ready = !loading && !loadError
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]))

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

    const editingId = form?.mode === 'edit' ? form.product.id : null
    const takenNames = products.filter((product) => product.id !== editingId).map((product) => product.name)

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

    function openForm(nextForm: FormState) {
        setForm(nextForm)
        setNotice(null)
    }

    function replaceProduct(saved: Product) {
        setProducts((list) => list.map((product) => (product.id === saved.id ? saved : product)))
        setSavedId(saved.id)
    }

    async function saveProduct(values: NewProduct): Promise<string | null> {
        if (form?.mode === 'edit') {
            const result = await updateProduct(form.product.id, values)
            if (!result.ok) return result.message

            replaceProduct(result.data)
            setNotice({ type: 'success', text: `Đã lưu thay đổi của "${result.data.name}".` })
        } else {
            const result = await createProduct(values)
            if (!result.ok) return result.message

            setProducts((list) => [...list, result.data])
            setSavedId(result.data.id)
            setKeyword('')
            setCategoryId(null)
            setStatus('all')
            setPage(Math.ceil((products.length + 1) / PAGE_SIZE))
            setNotice({ type: 'success', text: `Đã thêm "${result.data.name}" với mã #${result.data.id}.` })
        }

        return null
    }

    async function toggleActive(product: Product) {
        setBusyId(product.id)
        const result = await updateProduct(product.id, { active: !product.active })
        setBusyId(null)

        if (!result.ok) {
            setNotice({ type: 'error', text: `Chưa đổi được trạng thái của "${product.name}". ${result.message}` })
            return
        }

        replaceProduct(result.data)
        setNotice({
            type: 'success',
            text: result.data.active
                ? `Đã hiện lại "${product.name}" trên cửa hàng.`
                : `Đã ẩn "${product.name}". Khách không thấy cây này nữa, các đơn đã đặt vẫn giữ nguyên.`,
        })
    }

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <div className="product-admin__intro">
                        <h1>Quản lý cây giống</h1>
                        <p>Cây không bán nữa thì ẩn đi thay vì xóa, để các đơn đã đặt vẫn giữ đúng thông tin.</p>
                        <a className="product-page__back" href="/quan-ly/tin-tuc">Quản lý tin tức →</a>

                    </div>
                    {ready && (
                        <button type="button" className="product-admin__add" onClick={() => openForm({ mode: 'add' })}>
                            + Thêm cây giống
                        </button>
                    )}
                </header>

                {loading && <StatePanel variant="loading">Đang tải danh sách cây...</StatePanel>}

                {!loading && loadError && (
                    <StatePanel variant="error" title="Chưa tải được danh sách cây" actionLabel="Thử lại" onAction={retry}>
                        {loadError}
                    </StatePanel>
                )}

                {ready && (
                    <>
                        {form && (
                            <ProductForm
                                key={editingId ?? 'new'}
                                title={form.mode === 'edit' ? `Sửa cây #${form.product.id}: ${form.product.name}` : 'Thêm cây giống mới'}
                                initialValues={form.mode === 'edit' ? toFormValues(form.product) : EMPTY_PRODUCT_FORM}
                                categories={categories}
                                takenNames={takenNames}
                                onSave={saveProduct}
                                onClose={() => setForm(null)}
                            />
                        )}

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

                        {notice && (
                            <p
                                className={`product-admin__notice is-${notice.type}`}
                                role={notice.type === 'error' ? 'alert' : 'status'}
                            >
                                {notice.text}
                            </p>
                        )}

                        <p className="product-admin__count" role="status" ref={countRef}>
                            {rows.length === 0
                                ? `Hiển thị 0 / ${products.length} cây`
                                : `Hiển thị ${start + 1}–${start + pageRows.length} trong ${rows.length} cây`}
                        </p>

                        {rows.length === 0 ? (
                            <StatePanel variant="empty" title="Không tìm thấy cây phù hợp" actionLabel="Xóa bộ lọc" onAction={resetFilters}>
                                Không có cây nào khớp cùng lúc: {activeFilters.join(', ')}.
                            </StatePanel>
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
                                            <th scope="col">Thao tác</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {pageRows.map((product) => (
                                            <tr
                                                key={product.id}
                                                className={`${product.active ? '' : 'is-hidden'} ${product.id === savedId ? 'is-saved' : ''}`}
                                            >
                                                <td data-label="Mã">#{product.id}</td>
                                                <td data-label="Cây giống" className="is-name">
                                                    <div className="product-admin__product">
                                                        <img src={product.imageUrl} alt="" width={48} height={48} loading="lazy" />
                                                        <span>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td data-label="Danh mục">{categoryNames.get(product.categoryId) ?? `Danh mục ${product.categoryId}`}</td>
                                                <td data-label="Giá" className="is-number">{formatVND(product.price)}</td>
                                                <td data-label="Tồn kho mẫu" className="is-number">
                                                    {product.stock > 0 ? product.stock : (
                                                        <span className="product-admin__badge is-out">Hết hàng</span>
                                                    )}
                                                </td>
                                                <td data-label="Trạng thái">
                                                        <span className={`product-admin__badge ${product.active ? 'is-active' : 'is-hidden'}`}>
                                                            {product.active ? STATUS_LABELS.active : STATUS_LABELS.hidden}
                                                        </span>
                                                </td>
                                                <td className="is-actions">
                                                    <div className="product-admin__actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => openForm({ mode: 'edit', product })}
                                                            aria-label={`Sửa ${product.name}`}
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={product.active ? 'is-hide' : 'is-show'}
                                                            onClick={() => toggleActive(product)}
                                                            disabled={busyId === product.id}
                                                            aria-label={`${product.active ? 'Ẩn' : 'Hiện'} ${product.name}`}
                                                        >
                                                            {busyId === product.id ? 'Đang lưu...' : product.active ? 'Ẩn' : 'Hiện'}
                                                        </button>
                                                    </div>
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

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useApiData } from '../hooks/useApiData'
import { useCompare } from '../hooks/useCompare'
import { getCategories, getProducts } from '../services/productService'
import { formatVND } from '../utils/currency'
import { parseCareGuide } from '../utils/careGuide'
import { COMPARE_LIMIT } from '../utils/compareStorage'
import { careLevelLabel, sunlightLabel } from '../utils/plantConditions'
import AddToCartForm from '../components/AddToCartForm'
import StatePanel from '../components/StatePanel'
import '../style/ProductListPage.css'
import '../style/Compare.css'

async function loadCompareData() {
    const [products, categories] = await Promise.all([getProducts(), getCategories()])
    return { products, categories: categories.ok ? categories.data : [] }
}

function careOf(product: Product) {
    return new Map(parseCareGuide(product.careGuide).map((step) => [step.label || 'Ghi chú', step.text]))
}

function ComparePage() {
    const { ids, storageError, removeCompare, clearCompare } = useCompare()
    const { data, retry } = useApiData(loadCompareData)

    const result = data?.products ?? null
    const active = new Map((result?.ok ? result.data : []).filter((product) => product.active).map((product) => [product.id, product]))
    const categoryNames = new Map((data?.categories ?? []).map((category) => [category.id, category.name]))
    const products = ids.map((id) => active.get(id)).filter((product): product is Product => product !== undefined)
    const missing = ids.filter((id) => !active.has(id))
    const ready = result?.ok === true

    const cares = products.map(careOf)
    const careLabels = [...new Set(cares.flatMap((care) => [...care.keys()]))]
    const lowestPrice = products.length > 1 ? Math.min(...products.map((product) => product.price)) : null

    const rows: { label: string; cells: (product: Product, index: number) => ReactNode }[] = [
        {
            label: 'Giá',
            cells: (product) => (
                <span className={product.price === lowestPrice ? 'compare-table__best' : undefined}>
                    {formatVND(product.price)}
                    {product.price === lowestPrice && <small>Giá thấp nhất</small>}
                </span>
            ),
        },
        { label: 'Danh mục', cells: (product) => categoryNames.get(product.categoryId) ?? '—' },
        { label: 'Chiều cao', cells: (product) => `Khoảng ${product.heightCm} cm` },
        { label: 'Quy cách bầu', cells: (product) => product.bagSize },
        { label: 'Ánh sáng', cells: (product) => sunlightLabel(product.sunlight) },
        { label: 'Độ dễ chăm', cells: (product) => careLevelLabel(product.careLevel) },
        { label: 'Tình trạng', cells: (product) => (product.stock > 0 ? `Còn ${product.stock} cây` : 'Hết hàng') },
        ...careLabels.map((label) => ({ label, cells: (_: Product, index: number) => cares[index].get(label) ?? '—' })),
    ]

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <h1>So sánh cây giống</h1>
                    {ids.length > 0 && (
                        <div className="compare-page__summary">
                            <p>Đang chọn {ids.length}/{COMPARE_LIMIT} cây</p>
                            <button type="button" onClick={clearCompare}>Bỏ chọn hết</button>
                        </div>
                    )}
                </header>

                {storageError && <p className="compare-page__note is-warning" role="alert">{storageError}.</p>}

                {ids.length === 0 && (
                    <StatePanel variant="empty" title="Chưa chọn cây nào để so sánh" actionLabel="Xem cây giống" actionHref="/san-pham">
                        Bấm nút "So sánh" trên thẻ cây hoặc trang chi tiết, chọn tối đa {COMPARE_LIMIT} cây.
                    </StatePanel>
                )}

                {ids.length > 0 && result === null && <StatePanel variant="loading">Đang tải thông tin cây...</StatePanel>}

                {ids.length > 0 && result && !result.ok && (
                    <StatePanel variant="error" title="Chưa tải được thông tin cây" actionLabel="Thử lại" onAction={retry}>
                        {result.message}
                    </StatePanel>
                )}

                {ready && missing.length > 0 && (
                    <p className="compare-page__note">
                        {missing.length} cây đã chọn hiện ngừng bán nên không hiển thị.
                        <button type="button" onClick={() => removeCompare(missing)}>Bỏ khỏi so sánh</button>
                    </p>
                )}

                {ready && products.length === 1 && (
                    <p className="compare-page__note">
                        Chọn thêm ít nhất 1 cây để so sánh. <Link to="/san-pham">Chọn thêm cây →</Link>
                    </p>
                )}

                {ready && products.length > 0 && (
                    <div className="compare-table__wrap">
                        <table className="compare-table">
                            <caption className="ui-visually-hidden">Bảng so sánh cây giống</caption>
                            <thead>
                                <tr>
                                    <td />
                                    {products.map((product) => (
                                        <th key={product.id} scope="col">
                                            <img src={product.imageUrl} alt="" width={160} height={160} loading="lazy" />
                                            <Link to={`/san-pham/${product.id}`}>{product.name}</Link>
                                            <button
                                                type="button"
                                                className="compare-table__remove"
                                                onClick={() => removeCompare([product.id])}
                                                aria-label={`Bỏ ${product.name} khỏi so sánh`}
                                            >
                                                Bỏ chọn
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.label}>
                                        <th scope="row">{row.label}</th>
                                        {products.map((product, index) => (
                                            <td key={product.id}>{row.cells(product, index)}</td>
                                        ))}
                                    </tr>
                                ))}
                                <tr>
                                    <th scope="row">Mua</th>
                                    {products.map((product) => (
                                        <td key={product.id}>
                                            {product.stock > 0
                                                ? <AddToCartForm product={product} showQuantity={false} />
                                                : <span className="compare-table__muted">Tạm hết hàng</span>}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    )
}

export default ComparePage

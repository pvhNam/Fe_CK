import type {Product} from '../types'
import {useApiData} from '../hooks/useApiData'
import {useFavorites} from '../hooks/useFavorites'
import {getActiveProducts, getCategories} from '../services/productService'
import ProductCard from '../components/ProductCard'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import StatePanel from '../components/StatePanel'
import '../style/ProductListPage.css'
import '../style/FavoritesPage.css'

async function loadFavoriteData() {
    const [products, categories] = await Promise.all([getActiveProducts(), getCategories()])
    return {products, categories: categories.ok ? categories.data : []}
}

function FavoritesPage() {
    const {ids, storageError, removeFavorites} = useFavorites()
    const {data, retry} = useApiData(loadFavoriteData)

    const result = data?.products ?? null
    const productById = new Map((result?.ok ? result.data : []).map((product) => [product.id, product]))
    const categoryNames = new Map((data?.categories ?? []).map((category) => [category.id, category.name]))
    const saved = ids.map((id) => productById.get(id)).filter((product): product is Product => product !== undefined)
    const missing = ids.filter((id) => !productById.has(id))
    const ready = result?.ok === true

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <h1>Cây yêu thích</h1>
                    {ready && saved.length > 0 && <p>Đã lưu {saved.length} cây</p>}
                </header>

                {storageError && <p className="favorites-page__note is-warning" role="alert">{storageError}.</p>}

                {ids.length === 0 && (
                    <StatePanel variant="empty" title="Chưa có cây yêu thích" actionLabel="Xem cây giống"
                                actionHref="/san-pham">
                        Bấm biểu tượng trái tim trên thẻ cây để lưu lại và xem sau.
                    </StatePanel>
                )}

                {ids.length > 0 && result === null && (
                    <>
                        <p className="ui-visually-hidden" role="status">Đang tải cây yêu thích...</p>
                        <ProductGridSkeleton count={Math.min(ids.length, 8)}/>
                    </>
                )}

                {ids.length > 0 && result && !result.ok && (
                    <StatePanel variant="error" title="Chưa tải được cây yêu thích" actionLabel="Thử lại"
                                onAction={retry}>
                        {result.message}
                    </StatePanel>
                )}

                {ready && ids.length > 0 && saved.length === 0 && (
                    <StatePanel
                        variant="empty"
                        title="Các cây đã lưu hiện ngừng bán"
                        actionLabel="Dọn danh sách"
                        onAction={() => removeFavorites(missing)}
                    >
                        Cửa hàng đã ngừng bán những cây bạn lưu trước đó.
                    </StatePanel>
                )}

                {ready && saved.length > 0 && (
                    <>
                        {missing.length > 0 && (
                            <p className="favorites-page__note">
                                {missing.length} cây đã lưu hiện ngừng bán nên không hiển thị.
                                <button type="button" onClick={() => removeFavorites(missing)}>Bỏ khỏi danh
                                    sách</button>
                            </p>
                        )}
                        <div className="product-grid">
                            {saved.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    categoryName={categoryNames.get(product.categoryId)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}

export default FavoritesPage
import {useCallback} from 'react'
import {useApiData} from '../hooks/useApiData'
import {getProductById} from '../services/productService'
import {formatVND} from '../utils/currency'
import {parseCareGuide} from '../utils/careGuide'
import AddToCartForm from '../components/AddToCartForm'
import '../style/ProductListPage.css'
import '../style/ProductDetailPage.css'

function ProductDetailPage({productId}: { productId: number }) {
    const load = useCallback(() => getProductById(productId), [productId])
    const {data: result, retry} = useApiData(load)
    const product = result?.ok && result.data.active ? result.data : null
    const notFound = result !== null && (result.ok ? !result.data.active : result.status === 404)

    return (
        <main className="product-page">
            <div className="product-page__container">
                <a className="product-page__back" href="/san-pham">← Danh sách cây giống</a>

                {result === null && (
                    <p className="product-page__status" role="status">Đang tải thông tin cây...</p>
                )}

                {notFound && (
                    <p className="product-page__status" role="alert">Không tìm thấy cây giống này.</p>
                )}

                {result && !result.ok && !notFound && (
                    <div className="product-page__status is-error" role="alert">
                        <p>Chưa tải được thông tin cây giống.</p>
                        <button type="button" onClick={retry}>Thử lại</button>
                    </div>
                )}

                {product && (
                    <article className="product-detail">
                        <img
                            className="product-detail__image"
                            src={product.imageUrl}
                            alt={product.name}
                            width={600}
                            height={600}
                        />
                        <div>
                            <h1>{product.name}</h1>
                            <p className="product-detail__price">{formatVND(product.price)}</p>
                            <dl className="product-detail__specs">
                                <div>
                                    <dt>Chiều cao</dt>
                                    <dd>{product.heightCm} cm</dd>
                                </div>
                                <div>
                                    <dt>Quy cách</dt>
                                    <dd>{product.bagSize}</dd>
                                </div>
                                <div>
                                    <dt>Tình trạng</dt>
                                    <dd>{product.stock > 0 ? `Còn ${product.stock} cây` : 'Hết hàng'}</dd>
                                </div>
                            </dl>
                            <AddToCartForm product={product} />
                            <p>{product.description}</p>
                            <h2>Hướng dẫn chăm sóc</h2>
                            <ul className="care-guide">
                                {parseCareGuide(product.careGuide).map((step) => (
                                    <li key={step.label + step.text}>
                                        {step.label && <strong>{step.label}</strong>}
                                        <span>{step.text}</span>
                                    </li>
                                ))}
                            </ul>
                            <a className="product-page__back" href={`/san-pham?danhMuc=${product.categoryId}`}>
                                Xem cây cùng danh mục →
                            </a>
                        </div>
                    </article>
                )}
            </div>
        </main>
    )
}

export default ProductDetailPage
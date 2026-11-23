import '../style/StatePanel.css'

/** Khung chờ cùng lưới và tỷ lệ ảnh với ProductCard, tránh nhảy bố cục khi dữ liệu về. */
function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="product-grid" aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
                <div className="product-skeleton" key={index}>
                    <div className="product-skeleton__media" />
                    <div className="product-skeleton__body">
                        <span className="product-skeleton__line is-short" />
                        <span className="product-skeleton__line" />
                        <span className="product-skeleton__line is-price" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductGridSkeleton

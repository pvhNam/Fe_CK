import {useEffect} from 'react'
import {useApiData} from '../hooks/useApiData'
import {getShippingMethods} from '../services/checkoutService'
import {formatVND} from '../utils/currency'
import '../style/InfoPage.css'

const plantGroups = [
    {id: 1, name: 'Cây ăn quả', description: 'Xoài, ổi, mít, chanh và bưởi.'},
    {id: 2, name: 'Cây rau', description: 'Các giống rau cho vườn nhà, ban công và sân thượng.'},
    {id: 3, name: 'Cây gia vị', description: 'Húng quế, bạc hà, tía tô và những loại gia vị quen thuộc.'},
    {id: 4, name: 'Hoa và cây cảnh', description: 'Thêm sắc hoa và màu xanh cho không gian sống.'},
]

function AboutPage() {
    const {data: shipping, retry} = useApiData(getShippingMethods)

    useEffect(() => {
        const sectionId = window.location.hash.slice(1)
        document.getElementById(sectionId)?.scrollIntoView({block: 'start'})
    }, [])

    return (
        <main className="info-page">
            <div className="info-container">
                <nav className="info-breadcrumb" aria-label="Đường dẫn">
                    <a href="/">Trang chủ</a>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">Giới thiệu</span>
                </nav>

                <section className="info-about" aria-labelledby="about-title">
                    <div>
                        <p className="info-eyebrow">Ươm mầm cho cuộc sống</p>
                        <h1 id="about-title">Về Mầm Xanh</h1>
                        <p className="info-lead">
                            Bắt đầu một khu vườn từ những cây giống nhỏ.
                        </p>
                        <p>
                            Mầm Xanh mang đến các giống cây ăn quả, rau, gia vị, hoa và cây cảnh
                            cho vườn nhà. Từ một góc ban công đến khu vườn rộng,
                            bạn có thể tìm cây phù hợp và tham khảo cách chăm sóc
                            để vun trồng không gian xanh của riêng mình.
                        </p>
                        <div className="info-actions">
                            <a className="info-button" href="/san-pham">Khám phá cây giống →</a>
                            <a className="info-text-link" href="/lien-he">Thông tin liên hệ</a>
                        </div>
                    </div>
                    <img
                        className="info-about__image"
                        src="/images/products/hung-que.jpg"
                        alt="Những chậu húng quế xanh"
                        width={600}
                        height={800}
                    />
                </section>

                <aside className="info-support-note" aria-label="Gợi ý chọn cây">
                    <strong>Chọn cây phù hợp với khu vườn của bạn</strong>
                    <p>
                        Tham khảo nhu cầu ánh sáng, cách tưới nước và quy cách bầu
                        trên trang chi tiết sản phẩm trước khi chọn cây.
                        Một giống cây phù hợp sẽ giúp việc chăm vườn trở nên dễ dàng hơn.
                    </p>
                </aside>

                <section className="info-section" aria-labelledby="plant-groups-title">
                    <div className="info-section-heading">
                        <h2 id="plant-groups-title">Một mầm xanh cho mỗi góc vườn</h2>
                        <p>Xem ảnh, giá, chiều cao và quy cách bầu trước khi chọn cây.</p>
                    </div>
                    <div className="info-category-grid">
                        {plantGroups.map((group) => (
                            <a className="info-card info-category" href={`/san-pham?danhMuc=${group.id}`}
                               key={group.id}>
                                <h3>{group.name}</h3>
                                <p>{group.description}</p>
                                <span aria-hidden="true">Xem cây giống →</span>
                            </a>
                        ))}
                    </div>
                </section>

                <section className="info-section" aria-labelledby="purchase-policy-title" id="chinh-sach-mua-hang">
                    <div className="info-section-heading">
                        <h2 id="purchase-policy-title">Chính sách mua cây</h2>
                        <p>Những điều cần biết khi chọn cây và đặt hàng tại Mầm Xanh.</p>
                    </div>
                    <div className="info-two-columns">
                        <section className="info-card" aria-labelledby="purchase-steps-title">
                            <h3 id="purchase-steps-title">Chọn cây và thông tin nhận hàng</h3>
                            <ol className="info-list">
                                <li>Xem mô tả, chiều cao, quy cách bầu và hướng dẫn chăm sóc trên trang chi tiết cây.
                                </li>
                                <li>Chọn số lượng theo tình trạng còn hàng rồi thêm cây vào giỏ.</li>
                                <li>Kiểm tra tên cây, số lượng và tiền hàng. Bạn có thể điều chỉnh lựa chọn ngay tại
                                    giỏ.
                                </li>
                                <li>Điền họ tên, số điện thoại, khu vực và địa chỉ nhận cây ở bước thông tin người
                                    nhận.
                                </li>
                            </ol>
                            <a className="info-text-link" href="/gio-hang">Xem giỏ hàng →</a>
                        </section>
                        <section className="info-card" aria-labelledby="payment-policy-title">
                            <h3 id="payment-policy-title">Giá bán và thanh toán</h3>
                            <p>Giá bán, quy cách bầu và số lượng còn lại được hiển thị tại từng trang sản phẩm.</p>
                            <p>
                                Tiền hàng được tính theo đơn giá và số lượng. Tổng thanh toán
                                cộng thêm phí của phương thức giao được chọn.
                            </p>
                            <p>
                                Kiểm tra tổng tiền và thông tin người nhận trước khi hoàn tất
                                đơn hàng. Nếu cần điều chỉnh cây hoặc số lượng, bạn có thể
                                quay lại giỏ hàng để cập nhật lựa chọn.
                            </p>
                        </section>
                    </div>
                </section>

                <section className="info-section" aria-labelledby="delivery-policy-title" id="chinh-sach-giao-cay">
                    <div className="info-section-heading">
                        <h2 id="delivery-policy-title">Chính sách giao cây</h2>
                        <p>Tham khảo hình thức giao, mức phí và thời gian nhận cây.</p>
                    </div>
                    <div className="info-two-columns">
                        <section className="info-card" aria-labelledby="shipping-methods-title">
                            <h3 id="shipping-methods-title">Phương thức giao</h3>
                            {shipping === null && <p role="status">Đang tải phí giao cây...</p>}
                            {shipping && !shipping.ok && (
                                <div role="alert">
                                    <p>Chưa tải được phí giao cây.</p>
                                    <button className="info-button" type="button" onClick={retry}>Thử lại</button>
                                </div>
                            )}
                            {shipping?.ok && (
                                shipping.data.length > 0 ? (
                                    <ul className="info-delivery-list">
                                        {shipping.data.map((method) => (
                                            <li key={method.id}>
                                                <div>
                                                    <strong>{method.name}</strong>
                                                    <p>Dự kiến {method.estimatedDays}</p>
                                                </div>
                                                <span>{formatVND(method.fee)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Các phương thức giao đang được cập nhật.</p>
                                )
                            )}
                        </section>
                        <section className="info-card" aria-labelledby="delivery-notes-title">
                            <h3 id="delivery-notes-title">Thông tin giao nhận</h3>
                            <ul className="info-list">
                                <li>Kiểm tra địa chỉ và số điện thoại trước khi lưu thông tin người nhận.</li>
                                <li>Ghi chú vị trí nhận hoặc lưu ý về cây ở ô ghi chú của đơn.</li>
                                <li>Thời gian nhận cây phụ thuộc phương thức giao, khu vực nhận và điều kiện vận
                                    chuyển.
                                </li>
                                <li>Khi nhận hàng, kiểm tra tên cây, số lượng và tình trạng bầu cây. Nếu cần hỗ trợ, hãy
                                    gửi thông tin đơn hàng kèm ảnh cây để trao đổi.
                                </li>
                            </ul>
                            <a className="info-text-link" href="/lien-he">Liên hệ Mầm Xanh →</a>
                        </section>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default AboutPage

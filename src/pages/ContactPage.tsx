import '../style/InfoPage.css'

const contactDetails = [
    {label: 'Email', value: '23130200@gmail.com', href: 'mailto:23130200@gmail.com'},
    {label: 'Điện thoại', value: 'Đang cập nhật'},
    {label: 'Địa chỉ', value: 'Đang cập nhật'},
    {label: 'Giờ hỗ trợ', value: 'Đang cập nhật'},
]

function ContactPage() {
    return (
        <main className="info-page">
            <div className="info-container">
                <nav className="info-breadcrumb" aria-label="Đường dẫn">
                    <a href="/">Trang chủ</a>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">Liên hệ</span>
                </nav>

                <header className="info-contact-heading">
                    <p className="info-eyebrow">Kết nối cùng Mầm Xanh</p>
                    <h1>Liên hệ Mầm Xanh</h1>
                    <p className="info-lead">Trao đổi về cây giống, cách chăm sóc và thông tin đơn hàng cùng Mầm
                        Xanh.</p>
                </header>

                <div className="info-two-columns">
                    <section className="info-card info-contact-card" aria-labelledby="contact-info-title">
                        <h2 id="contact-info-title">Thông tin liên hệ</h2>
                        <p>Gửi câu hỏi qua email để trao đổi về cây bạn quan tâm hoặc đơn hàng cần hỗ trợ.</p>
                        <dl className="info-contact-list">
                            {contactDetails.map((detail) => (
                                <div key={detail.label}>
                                    <dt>{detail.label}</dt>
                                    <dd>
                                        {detail.href ? (
                                            <a className="info-text-link" href={detail.href}>{detail.value}</a>
                                        ) : detail.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section className="info-card" aria-labelledby="contact-links-title">
                        <h2 id="contact-links-title">Bạn cần tìm gì?</h2>
                        <nav className="info-help-links" aria-label="Thông tin hỗ trợ">
                            <a href="/san-pham">
                                <span>
                                    <strong>Tìm cây giống</strong>
                                    <span>Xem đặc điểm, giá và hướng dẫn chăm sóc từng cây.</span>
                                </span>
                                <span aria-hidden="true">→</span>
                            </a>
                            <a href="/gio-hang">
                                <span>
                                    <strong>Kiểm tra giỏ hàng</strong>
                                    <span>Xem lại cây, số lượng và tiền hàng đã chọn.</span>
                                </span>
                                <span aria-hidden="true">→</span>
                            </a>
                            <a href="/gioi-thieu#chinh-sach-giao-cay">
                                <span>
                                    <strong>Phí và chính sách giao cây</strong>
                                    <span>Tham khảo phương thức giao, mức phí và thời gian nhận cây.</span>
                                </span>
                                <span aria-hidden="true">→</span>
                            </a>
                        </nav>
                    </section>
                </div>

                <aside className="info-support-note" aria-label="Hướng dẫn liên hệ">
                    <strong>Để việc hỗ trợ thuận tiện hơn</strong>
                    <p>
                        Khi gửi email, bạn có thể kèm tên cây, số lượng hoặc thông tin đơn hàng
                        cần trao đổi. Với câu hỏi về chăm sóc, hãy mô tả tình trạng cây
                        và gửi thêm ảnh để Mầm Xanh có đủ thông tin hỗ trợ.
                    </p>
                </aside>

                <section className="info-section" aria-labelledby="contact-questions-title">
                    <div className="info-section-heading">
                        <h2 id="contact-questions-title">Thông tin thường cần</h2>
                    </div>
                    <div className="info-questions">
                        <details>
                            <summary>Tôi xem cách chăm cây ở đâu?</summary>
                            <p>
                                Mở trang chi tiết cây để xem thông tin ánh sáng, tưới nước
                                và chăm sóc. Bạn cũng có thể tham khảo thêm các bài
                                trong <a href="/tin-tuc">trang tin tức</a>.
                            </p>
                        </details>
                        <details>
                            <summary>Tổng tiền mua cây được tính như thế nào?</summary>
                            <p>
                                Tiền hàng là tổng đơn giá nhân số lượng của từng cây.
                                Phí giao phụ thuộc phương thức giao được chọn.
                                Bạn có thể xem lại <a href="/gioi-thieu#chinh-sach-mua-hang">chính sách mua cây</a>.
                            </p>
                        </details>
                        <details>
                            <summary>Tôi cần gửi thông tin gì khi liên hệ?</summary>
                            <p>
                                Bạn có thể gửi tên cây, số lượng dự kiến hoặc thông tin đơn hàng
                                cần hỗ trợ về <a href="mailto:23130200@gmail.com">23130200@gmail.com</a>.
                                Nếu hỏi về cách chăm cây, hãy kèm ảnh và mô tả tình trạng cây.
                            </p>
                        </details>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default ContactPage

import '../style/HomePage.css'
import { useRef, useState } from 'react'
const featuredProducts = [
    {
        id: 1,
        name: 'Xoài cát Hòa Lộc',
        price: 65000,
        image: '/images/products/xoai.jpg',
    },
    {
        id: 2,
        name: 'Chanh không hạt',
        price: 50000,
        image: '/images/products/chanh.jpg',
    },
    {
        id: 3,
        name: 'Húng quế',
        price: 15000,
        image: '/images/products/hung-que.jpg',
    },
    {
        id: 4,
        name: 'Hoa hồng',
        price: 55000,
        image: '/images/products/hoa-hong.jpg',
    },
]

const priceFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
})
const banners = [
    {
        id: 1,
        label: 'MẦM XANH — ƯƠM MẦM CUỘC SỐNG',
        title: 'Mang một chút xanh về khu vườn của bạn.',
        description:
            'Khám phá những cây giống ăn quả, rau gia vị và cây cảnh. Bắt đầu niềm vui trồng cây từ những mầm nhỏ.',
        image: '/images/products/hung-que.jpg',
        alt: 'Những chậu húng quế xanh',
    },
    {
        id: 2,
        label: 'VƯỜN CÂY ĂN QUẢ',
        title: 'Trồng cây hôm nay, hái quả ngày mai.',
        description:
            'Chọn cây giống xoài, chanh, ổi và nhiều loại cây ăn quả để vun trồng khu vườn của riêng bạn.',
        image: '/images/products/xoai.jpg',
        alt: 'Cây giống xoài',
    },
    {
        id: 3,
        label: 'HOA VÀ CÂY CẢNH',
        title: 'Thêm sắc hoa, thêm vui mỗi ngày.',
        description:
            'Mang màu sắc thiên nhiên đến ban công, sân vườn và những góc nhỏ thân quen trong ngôi nhà.',
        image: '/images/products/hoa-giay.jpg',
        alt: 'Hoa giấy',
    },
]
function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0)

    const touchStart = useRef<{ x: number; y: number } | null>(null)

    function previousSlide() {
        setCurrentSlide(
            (current) => (current - 1 + banners.length) % banners.length,
        )
    }

    function nextSlide() {
        setCurrentSlide((current) => (current + 1) % banners.length)
    }
    return (

        <main className="home-page">
            {/* ICON NỔI BÊN PHẢI */}
            <div className="contact-icons" aria-hidden="true">
                {/* Điện thoại */}
                <span className="contact-icon contact-icon-phone">
    <svg viewBox="0 0 24 24">
      <path
          d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2
        a1 1 0 0 1 1-.24c1.1.36 2.3.55 3.6.55
        a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1
        C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5
        a1 1 0 0 1 1 1c0 1.3.19 2.5.55 3.6
        a1 1 0 0 1-.25 1z"
      />
    </svg>
  </span>

                {/* Zalo */}
                <span className="contact-icon contact-icon-zalo">
    <svg viewBox="0 0 48 48">
      <path
          fill="#ffffff"
          d="M24 5C12.4 5 4 12.4 4 22
        c0 5.6 2.8 10.2 7.4 13.3L9 43l9.7-4.2
        c1.7.4 3.5.6 5.3.6
        11.6 0 20-7.4 20-17S35.6 5 24 5Z"
      />

      <text
          x="24"
          y="27"
          textAnchor="middle"
          fill="#0068ff"
          fontFamily="Arial, sans-serif"
          fontSize="14"
          fontWeight="700"
      >
        Zalo
      </text>
    </svg>
  </span>

                {/* Facebook */}
                <span className="contact-icon contact-icon-facebook">
    <svg viewBox="0 0 24 24">
      <path
          d="M14 8V6.5C14 5.6 14.6 5 15.5 5H18V1
        h-3.2C11.8 1 10 3 10 6v2H7v4h3v11h4V12
        h3.4l.6-4H14Z"
      />
    </svg>
  </span>
            </div>
            {/* BANNER NHIỀU SLIDE */}
            <section
                className="home-slider"
                aria-label="Banner giới thiệu Mầm Xanh"
                aria-roledescription="trình chiếu"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.altKey || event.ctrlKey || event.metaKey) return

                    if (event.key === 'ArrowLeft') {
                        event.preventDefault()
                        previousSlide()
                    }

                    if (event.key === 'ArrowRight') {
                        event.preventDefault()
                        nextSlide()
                    }
                }}
            >
                <div className="home-container">
                    <div
                        className="home-slider-viewport"
                        onTouchStart={(event) => {
                            const touch = event.touches[0]

                            touchStart.current =
                                touch && event.touches.length === 1
                                    ? { x: touch.clientX, y: touch.clientY }
                                    : null
                        }}
                        onTouchEnd={(event) => {
                            const start = touchStart.current
                            const end = event.changedTouches[0]

                            touchStart.current = null

                            if (!start || !end) return

                            const distanceX = start.x - end.clientX
                            const distanceY = start.y - end.clientY

                            // Chỉ đổi banner khi vuốt ngang đủ xa
                            if (
                                Math.abs(distanceX) < 50 ||
                                Math.abs(distanceX) <= Math.abs(distanceY)
                            ) {
                                return
                            }

                            if (distanceX > 0) {
                                nextSlide()
                            } else {
                                previousSlide()
                            }
                        }}
                        onTouchCancel={() => {
                            touchStart.current = null
                        }}
                    >
                        <div
                            className="home-slider-track"
                            style={{
                                transform: `translateX(-${currentSlide * 100}%)`,
                            }}
                        >
                            {banners.map((banner, index) => (
                                <article
                                    className="home-slide"
                                    key={banner.id}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`Banner ${index + 1} trên ${banners.length}`}
                                    aria-hidden={index !== currentSlide}
                                    inert={index !== currentSlide}
                                >
                                    <img
                                        className="home-slide-image"
                                        src={banner.image}
                                        alt={banner.alt}
                                        width={1720}
                                        height={550}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        draggable={false}
                                    />
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* NÚT ĐIỀU KHIỂN */}
                    <div className="home-slider-controls">
                        <button
                            type="button"
                            className="home-slider-arrow"
                            onClick={previousSlide}
                            aria-label="Banner trước"
                        >
                            <span aria-hidden="true">‹</span>
                        </button>

                        <div className="home-slider-dots">
                            {banners.map((banner, index) => (
                                <button
                                    type="button"
                                    key={banner.id}
                                    className={`home-slider-dot ${
                                        currentSlide === index ? 'is-active' : ''
                                    }`}
                                    onClick={() => setCurrentSlide(index)}
                                    aria-label={`Xem banner ${index + 1}`}
                                    aria-pressed={currentSlide === index}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            className="home-slider-arrow"
                            onClick={nextSlide}
                            aria-label="Banner tiếp theo"
                        >
                            <span aria-hidden="true">›</span>
                        </button>
                    </div>

                    <p className="home-slider-status" role="status" aria-atomic="true">
                        Banner {currentSlide + 1} trên {banners.length}
                    </p>
                </div>
            </section>

            <section
                id="san-pham-noi-bat"
                className="home-featured"
                aria-labelledby="featured-title"
            >
                <div className="home-container">
                    <div className="home-featured__heading">
                        <h2 id="featured-title">Sản phẩm nổi bật</h2>
                        <p>Chọn một mầm xanh cho khu vườn của bạn.</p>
                    </div>

                    <div className="home-product-grid">
                        {featuredProducts.map((product) => (
                            <article className="home-product-card" key={product.id}>
                                <img
                                    className="home-product-card__image"
                                    src={product.image}
                                    alt={product.name}
                                    width={400}
                                    height={300}
                                    loading="lazy"
                                />

                                <div className="home-product-card__content">
                                    <h3>{product.name}</h3>

                                    <p className="home-product-card__price">
                                        {priceFormatter.format(product.price)}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default HomePage

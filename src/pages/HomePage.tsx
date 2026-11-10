import {useRef, useState} from 'react'
import type {KeyboardEvent, TouchEvent} from 'react'
import NewsCard from '../components/NewsCard'
import ProductCard from '../components/ProductCard'
import {useApiData} from '../hooks/useApiData'
import {getHomeData} from '../services/homeService'
import '../style/HomePage.css'

function HomePage() {
    const {data, retry} = useApiData(getHomeData)
    const [currentSlide, setCurrentSlide] = useState(0)
    const touchStart = useRef<{ x: number; y: number } | null>(null)

    const banners = data?.banners.ok ? data.banners.data : []
    const categories = data?.categories.ok ? data.categories.data : []
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]))
    const hasLoadError = data !== null && Object.values(data).some((result) => !result.ok)

    function previousSlide() {
        setCurrentSlide((current) => (current - 1 + banners.length) % banners.length)
    }

    function nextSlide() {
        setCurrentSlide((current) => (current + 1) % banners.length)
    }

    function handleBannerKeyDown(event: KeyboardEvent<HTMLElement>) {
        if (event.altKey || event.ctrlKey || event.metaKey || banners.length < 2) return
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

        event.preventDefault()
        if (event.target instanceof HTMLAnchorElement) event.currentTarget.focus()

        if (event.key === 'ArrowLeft') {
            previousSlide()
        } else {
            nextSlide()
        }
    }

    function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
        const touch = event.touches[0]

        touchStart.current =
            touch && event.touches.length === 1
                ? {x: touch.clientX, y: touch.clientY}
                : null
    }

    function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
        const start = touchStart.current
        const end = event.changedTouches[0]
        touchStart.current = null

        if (!start || !end || banners.length < 2) return

        const distanceX = start.x - end.clientX
        const distanceY = start.y - end.clientY
        if (Math.abs(distanceX) < 50 || Math.abs(distanceX) <= Math.abs(distanceY)) return

        if (distanceX > 0) {
            nextSlide()
        } else {
            previousSlide()
        }
    }

    return (
        <main className="home-page">
            <h1 className="home-visually-hidden">Mầm Xanh</h1>
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

            {data === null && (
                <div className="home-container">
                    <p className="home-message" role="status">Đang tải trang chủ...</p>
                </div>
            )}

            {hasLoadError && (
                <div className="home-container">
                    <div className="home-message" role="alert">
                        <p>Chưa tải được đầy đủ nội dung trang chủ.</p>
                        <button
                            className="home-button"
                            type="button"
                            onClick={() => {
                                setCurrentSlide(0)
                                retry()
                            }}
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {banners.length > 0 && (
                <section
                    className="home-slider"
                    aria-label="Banner giới thiệu Mầm Xanh"
                    aria-roledescription="trình chiếu"
                    tabIndex={0}
                    onKeyDown={handleBannerKeyDown}
                >
                    <div className="home-container">
                        <div
                            className="home-slider-viewport"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={() => {
                                touchStart.current = null
                            }}
                        >
                            <div
                                className="home-slider-track"
                                style={{transform: `translateX(-${currentSlide * 100}%)`}}
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
                                        <a className="home-slide-link" href={banner.href}>
                                            <img
                                                className="home-slide-image"
                                                src={banner.imageUrl}
                                                alt={banner.alt}
                                                width={1720}
                                                height={550}
                                                loading={index === 0 ? 'eager' : 'lazy'}
                                                draggable={false}
                                            />
                                        </a>
                                    </article>
                                ))}
                            </div>
                        </div>

                        {banners.length > 1 && (
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
                        )}

                        <p className="home-visually-hidden" role="status" aria-atomic="true">
                            Banner {currentSlide + 1} trên {banners.length}
                        </p>
                    </div>
                </section>
            )}

            {data?.categories.ok && (
                <section className="home-section" aria-labelledby="categories-title">
                    <div className="home-container">
                        <div className="home-section-heading">
                            <h2 id="categories-title">Danh mục cây giống</h2>
                        </div>

                        {categories.length > 0 ? (
                            <div className="home-category-grid">
                                {categories.map((category) => (
                                    <a
                                        className="home-category-link"
                                        href={`/san-pham?danhMuc=${category.id}`}
                                        key={category.id}
                                    >
                                        {category.name}
                                        <span aria-hidden="true">→</span>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="home-message">Chưa có danh mục cây giống.</p>
                        )}
                    </div>
                </section>
            )}

            {data?.featuredProducts.ok && (
                <section
                    id="san-pham-noi-bat"
                    className="home-section"
                    aria-labelledby="featured-title"
                >
                    <div className="home-container">
                        <div className="home-section-heading">
                            <h2 id="featured-title">Cây giống nổi bật</h2>
                            <a href="/san-pham">Xem tất cả cây giống →</a>
                        </div>

                        {data.featuredProducts.data.length > 0 ? (
                            <div className="home-product-grid">
                                {data.featuredProducts.data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        categoryName={categoryNames.get(product.categoryId)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="home-message">Chưa có cây giống nổi bật.</p>
                        )}
                    </div>
                </section>
            )}

            {data?.latestNews.ok && (
                <section className="home-section" aria-labelledby="latest-news-title">
                    <div className="home-container">
                        <div className="home-section-heading">
                            <h2 id="latest-news-title">Tin mới nhất</h2>
                            <a href="/tin-tuc">Xem tất cả tin tức →</a>
                        </div>

                        {data.latestNews.data.length > 0 ? (
                            <div className="news-grid">
                                {data.latestNews.data.map((news) => (
                                    <NewsCard key={news.id} news={news} />
                                ))}
                            </div>
                        ) : (
                            <p className="home-message">Chưa có tin tức được đăng.</p>
                        )}
                    </div>
                </section>
            )}
        </main>
    )
}

export default HomePage

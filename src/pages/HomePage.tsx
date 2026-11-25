import {Link} from 'react-router-dom'
import {useRef, useState} from 'react'
import type {KeyboardEvent, TouchEvent} from 'react'
import NewsCard from '../components/NewsCard'
import ProductCard from '../components/ProductCard'
import {useApiData} from '../hooks/useApiData'
import {getHomeData} from '../services/homeService'
import '../style/HomePage.css'
import StatePanel from '../components/StatePanel'

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

            {data === null && (
                <div className="home-container">
                    <StatePanel variant="loading">Đang tải trang chủ...</StatePanel>
                </div>
            )}

            {hasLoadError && (
                <div className="home-container">
                    <StatePanel
                        variant="error"
                        title="Chưa tải được đầy đủ nội dung trang chủ"
                        actionLabel="Thử lại"
                        onAction={() => {
                            setCurrentSlide(0)
                            retry()
                        }}
                    >
                        Kiểm tra kết nối rồi thử lại.
                    </StatePanel>
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
                                        <Link className="home-slide-link" to={banner.href}>
                                            <img
                                                className="home-slide-image"
                                                src={banner.imageUrl}
                                                alt={banner.alt}
                                                width={1720}
                                                height={550}
                                                loading={index === 0 ? 'eager' : 'lazy'}
                                                draggable={false}
                                            />
                                        </Link>
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
                                    <Link
                                        className="home-category-link"
                                        to={`/san-pham?danhMuc=${category.id}`}
                                        key={category.id}
                                    >
                                        {category.name}
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <StatePanel variant="empty" title="Chưa có danh mục cây giống">Danh mục sẽ được cập nhật
                                sớm.</StatePanel>
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
                            <Link to="/san-pham">Xem tất cả cây giống →</Link>
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
                            <StatePanel variant="empty" title="Chưa có cây giống nổi bật">Xem toàn bộ cây giống ở trang
                                sản phẩm.</StatePanel>
                        )}
                    </div>
                </section>
            )}

            {data?.latestNews.ok && (
                <section className="home-section" aria-labelledby="latest-news-title">
                    <div className="home-container">
                        <div className="home-section-heading">
                            <h2 id="latest-news-title">Tin mới nhất</h2>
                            <Link to="/tin-tuc">Xem tất cả tin tức →</Link>
                        </div>

                        {data.latestNews.data.length > 0 ? (
                            <div className="news-grid">
                                {data.latestNews.data.map((news) => (
                                    <NewsCard key={news.id} news={news}/>
                                ))}
                            </div>
                        ) : (
                            <StatePanel variant="empty" title="Chưa có tin tức được đăng">Bài viết mới sẽ xuất hiện ở
                                đây.</StatePanel>
                        )}
                    </div>
                </section>
            )}
        </main>
    )
}

export default HomePage

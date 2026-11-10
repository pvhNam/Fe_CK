import {useCallback} from 'react'
import NewsCard from '../components/NewsCard'
import {useApiData} from '../hooks/useApiData'
import {getNewsById, getPublishedNews} from '../services/newsService'
import '../style/NewsPage.css'

function NewsDetailPage({newsId}: { newsId: number }) {
    const load = useCallback(() => getNewsById(newsId), [newsId])
    const {data: result, retry} = useApiData(load)
    const {data: publishedNews} = useApiData(getPublishedNews)
    const news = result?.ok && result.data.isPublished ? result.data : null
    const notFound = result !== null && (result.ok ? !result.data.isPublished : result.status === 404)
    const moreNews = publishedNews?.ok
        ? publishedNews.data.filter((item) => item.id !== newsId).slice(0, 3)
        : []

    return (
        <main className="news-page news-page--detail">
            <div className="news-page__container">
                <nav className="news-breadcrumb" aria-label="Đường dẫn">
                    <a href="/">Trang chủ</a>
                    <span aria-hidden="true">/</span>
                    <a href="/tin-tuc">Tin tức</a>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">Bài viết</span>
                </nav>

                {result === null && (
                    <p className="news-page__status" role="status">Đang tải bài viết...</p>
                )}

                {notFound && (
                    <div className="news-page__status" role="alert">
                        <h1>Không tìm thấy bài viết</h1>
                        <a className="news-page__back" href="/tin-tuc">← Về danh sách tin tức</a>
                    </div>
                )}

                {result && !result.ok && !notFound && (
                    <div className="news-page__status" role="alert">
                        <p>Chưa tải được bài viết.</p>
                        <button type="button" onClick={retry}>Thử lại</button>
                    </div>
                )}

                {news && (
                    <>
                        <article className="news-article">
                            <header className="news-article__header">
                                <p className="news-eyebrow">Bản tin Mầm Xanh</p>
                                <h1>{news.title}</h1>
                                <time dateTime={news.publishedAt}>
                                    {new Date(news.publishedAt).toLocaleDateString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})}
                                </time>
                                <p className="news-article__summary">{news.summary}</p>
                            </header>

                            <img
                                className="news-article__image"
                                src={news.imageUrl}
                                alt=""
                                width={900}
                                height={500}
                                decoding="async"
                            />

                            <div className="news-article__content">
                                {news.content.trim().split(/\r?\n\s*\r?\n/).filter(Boolean).map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            <footer className="news-article__footer">
                                <a className="news-page__back" href="/tin-tuc">← Về danh sách tin tức</a>
                            </footer>
                        </article>

                        {moreNews.length > 0 && (
                            <section className="news-section" aria-labelledby="more-news-title">
                                <div className="news-section__heading">
                                    <h2 id="more-news-title">Đọc thêm</h2>
                                    <a href="/tin-tuc">Xem tất cả tin tức →</a>
                                </div>
                                <div className="news-grid">
                                    {moreNews.map((item) => <NewsCard key={item.id} news={item} />)}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

export default NewsDetailPage

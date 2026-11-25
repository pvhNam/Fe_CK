import {Link} from 'react-router-dom'
import {useCallback} from 'react'
import NewsCard from '../components/NewsCard'
import {useApiData} from '../hooks/useApiData'
import {getNewsById, getPublishedNews} from '../services/newsService'
import '../style/NewsPage.css'
import StatePanel from '../components/StatePanel'
import {useRouteId} from '../hooks/useRouteId'
import RouteError from '../route/Error'

function NewsDetail({newsId}: { newsId: number }) {
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
                    <Link to="/">Trang chủ</Link>
                    <span aria-hidden="true">/</span>
                    <Link to="/tin-tuc">Tin tức</Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">Bài viết</span>
                </nav>

                {result === null && <StatePanel variant="loading">Đang tải bài viết...</StatePanel>}

                {notFound && (
                    <StatePanel variant="empty" titleAs="h1" title="Không tìm thấy bài viết"
                                actionLabel="Về danh sách tin tức" actionHref="/tin-tuc">
                        Bài viết có thể đã được ẩn hoặc đường dẫn chưa đúng.
                    </StatePanel>
                )}

                {result && !result.ok && !notFound && (
                    <StatePanel variant="error" title="Chưa tải được bài viết" actionLabel="Thử lại" onAction={retry}>
                        Kiểm tra kết nối rồi thử lại.
                    </StatePanel>
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
                                <Link className="news-page__back" to="/tin-tuc">← Về danh sách tin tức</Link>
                            </footer>
                        </article>

                        {moreNews.length > 0 && (
                            <section className="news-section" aria-labelledby="more-news-title">
                                <div className="news-section__heading">
                                    <h2 id="more-news-title">Đọc thêm</h2>
                                    <Link to="/tin-tuc">Xem tất cả tin tức →</Link>
                                </div>
                                <div className="news-grid">
                                    {moreNews.map((item) => <NewsCard key={item.id} news={item}/>)}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

export default function NewsDetailPage() {
    const newsId = useRouteId()
    return newsId === null ? <RouteError/> : <NewsDetail key={newsId} newsId={newsId}/>
}

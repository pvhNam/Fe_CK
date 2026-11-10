import NewsCard from '../components/NewsCard'
import {useApiData} from '../hooks/useApiData'
import {getPublishedNews} from '../services/newsService'
import '../style/NewsPage.css'

function NewsListPage() {
    const {data: result, retry} = useApiData(getPublishedNews)
    const [latestNews, ...otherNews] = result?.ok ? result.data : []

    return (
        <main className="news-page">
            <div className="news-page__container">
                <nav className="news-breadcrumb" aria-label="Đường dẫn">
                    <a href="/">Trang chủ</a>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">Tin tức</span>
                </nav>

                <header className="news-page__intro">
                    <p className="news-eyebrow">Góc vườn Mầm Xanh</p>
                    <h1>Tin tức Mầm Xanh</h1>
                    <p className="news-page__intro-description">
                        Tin mới từ cửa hàng, gợi ý chọn cây và những cách chăm vườn dễ áp dụng.
                    </p>
                </header>

                {result === null && (
                    <p className="news-page__status" role="status">Đang tải tin tức...</p>
                )}

                {result && !result.ok && (
                    <div className="news-page__status" role="alert">
                        <p>Chưa tải được tin tức.</p>
                        <button type="button" onClick={retry}>Thử lại</button>
                    </div>
                )}

                {result?.ok && !latestNews && (
                    <p className="news-page__status">Chưa có tin tức được đăng.</p>
                )}

                {latestNews && <NewsCard news={latestNews} featured />}

                {otherNews.length > 0 && (
                    <section className="news-section" aria-labelledby="recent-news-title">
                        <div className="news-section__heading">
                            <h2 id="recent-news-title">Bài viết gần đây</h2>
                            <span>{otherNews.length} bài viết</span>
                        </div>
                        <div className="news-grid">
                            {otherNews.map((news) => <NewsCard key={news.id} news={news} />)}
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}

export default NewsListPage

import NewsCard from '../components/NewsCard'
import {useApiData} from '../hooks/useApiData'
import {getPublishedNews} from '../services/newsService'
import '../style/NewsPage.css'
import StatePanel from '../components/StatePanel'

function NewsListPage() {
    const {data: result, retry} = useApiData(getPublishedNews)
    const [latestNews, ...otherNews] = result?.ok ? result.data : []

    return (
        <main className="news-page">
            <div className="news-page__container">
                <h1 className="news-visually-hidden">Tin tức Mầm Xanh</h1>
                <nav className="news-breadcrumb" aria-label="Đường dẫn">
                    <a href="/">Trang chủ</a>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">Tin tức</span>
                </nav>

                {result === null && <StatePanel variant="loading">Đang tải tin tức...</StatePanel>}

                {result && !result.ok && (
                    <StatePanel variant="error" title="Chưa tải được tin tức" actionLabel="Thử lại" onAction={retry}>
                        Kiểm tra kết nối rồi thử lại.
                    </StatePanel>
                )}

                {result?.ok && !latestNews && (
                    <StatePanel variant="empty" title="Chưa có tin tức được đăng">
                        Bài viết mới sẽ xuất hiện ở đây.
                    </StatePanel>
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

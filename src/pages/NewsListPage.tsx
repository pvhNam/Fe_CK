import NewsCard from '../components/NewsCard'
import {useApiData} from '../hooks/useApiData'
import {getPublishedNews} from '../services/newsService'
import '../style/NewsPage.css'

function NewsListPage() {
    const {data: result, retry} = useApiData(getPublishedNews)

    return (
        <main className="news-page">
            <div className="news-page__container">
                <h1>Tin tức</h1>

                {result === null && (
                    <p className="news-page__status" role="status">Đang tải tin tức...</p>
                )}

                {result && !result.ok && (
                    <div className="news-page__status" role="alert">
                        <p>Chưa tải được tin tức.</p>
                        <button type="button" onClick={retry}>Thử lại</button>
                    </div>
                )}

                {result?.ok && (
                    result.data.length > 0 ? (
                        <div className="news-grid">
                            {result.data.map((news) => <NewsCard key={news.id} news={news} />)}
                        </div>
                    ) : (
                        <p className="news-page__status">Chưa có tin tức được đăng.</p>
                    )
                )}
            </div>
        </main>
    )
}

export default NewsListPage

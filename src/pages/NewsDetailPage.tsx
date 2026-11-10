import {useCallback} from 'react'
import {useApiData} from '../hooks/useApiData'
import {getNewsById} from '../services/newsService'
import '../style/NewsPage.css'

function NewsDetailPage({newsId}: { newsId: number }) {
    const load = useCallback(() => getNewsById(newsId), [newsId])
    const {data: result, retry} = useApiData(load)
    const news = result?.ok && result.data.isPublished ? result.data : null
    const notFound = result !== null && (result.ok ? !result.data.isPublished : result.status === 404)

    return (
        <main className="news-page">
            <div className="news-page__container news-page__container--article">
                <a className="news-page__back" href="/tin-tuc">← Danh sách tin tức</a>

                {result === null && (
                    <p className="news-page__status" role="status">Đang tải bài viết...</p>
                )}

                {notFound && (
                    <p className="news-page__status" role="alert">Không tìm thấy bài viết này.</p>
                )}

                {result && !result.ok && !notFound && (
                    <div className="news-page__status" role="alert">
                        <p>Chưa tải được bài viết.</p>
                        <button type="button" onClick={retry}>Thử lại</button>
                    </div>
                )}

                {news && (
                    <article className="news-article">
                        <time dateTime={news.publishedAt}>
                            {new Date(news.publishedAt).toLocaleDateString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})}
                        </time>
                        <h1>{news.title}</h1>
                        <p className="news-article__summary">{news.summary}</p>
                        <img className="news-article__image" src={news.imageUrl} alt="" width={840} height={440} />
                        <p className="news-article__content">{news.content}</p>
                    </article>
                )}
            </div>
        </main>
    )
}

export default NewsDetailPage

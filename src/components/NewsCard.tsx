import type {News} from '../types'
import '../style/NewsPage.css'

function NewsCard({news, featured = false}: { news: News; featured?: boolean }) {
    const Title = featured ? 'h2' : 'h3'

    return (
        <article className={featured ? 'news-card news-card--featured' : 'news-card'}>
            <div className="news-card__media">
                <img
                    className="news-card__image"
                    src={news.imageUrl}
                    alt=""
                    width={featured ? 800 : 480}
                    height={featured ? 500 : 270}
                    loading={featured ? 'eager' : 'lazy'}
                    decoding="async"
                />
            </div>
            <div className="news-card__body">
                <div className="news-card__meta">
                    {featured && <span className="news-card__badge">Mới nhất</span>}
                    <time dateTime={news.publishedAt}>
                        {new Date(news.publishedAt).toLocaleDateString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})}
                    </time>
                </div>
                <Title className="news-card__title">
                    <a href={`/tin-tuc/${news.id}`}>{news.title}</a>
                </Title>
                <p>{news.summary}</p>
                <span className="news-card__read-more" aria-hidden="true">
                    Đọc bài viết <span>→</span>
                </span>
            </div>
        </article>
    )
}

export default NewsCard

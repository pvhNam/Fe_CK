import type {News} from '../types'
import '../style/NewsPage.css'

function NewsCard({news}: { news: News }) {
    return (
        <article className="news-card">
            <img className="news-card__image" src={news.imageUrl} alt="" width={480} height={270} loading="lazy" />
            <div className="news-card__body">
                <time dateTime={news.publishedAt}>
                    {new Date(news.publishedAt).toLocaleDateString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})}
                </time>
                <h3>
                    <a href={`/tin-tuc/${news.id}`}>{news.title}</a>
                </h3>
                <p>{news.summary}</p>
            </div>
        </article>
    )
}

export default NewsCard

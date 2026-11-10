import type { News, NewNews } from '../types'
import type { ApiResult } from './api'
import { getJson, patchJson, postJson } from './api'

export function getNews() {
    return getJson<News[]>('/news')
}

export async function getPublishedNews(limit?: number): Promise<ApiResult<News[]>> {
    const result = await getJson<News[]>('/news?isPublished=true')
    if (!result.ok) return result

    const news = [...result.data].sort(
        (first, second) => Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
    )
    return { ok: true, data: news.slice(0, limit) }
}

export function getNewsById(id: number) {
    return getJson<News>(`/news/${id}`)
}

export function createNews(news: NewNews) {
    return postJson<News>('/news', news)
}

export function updateNews(id: number, changes: Partial<NewNews>) {
    return patchJson<News>(`/news/${id}`, changes)
}

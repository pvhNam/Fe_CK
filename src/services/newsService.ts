import type { News, NewNews } from '../types'
import { getJson, patchJson, postJson } from './api'

export function getNews() {
    return getJson<News[]>('/news')
}

export function getPublishedNews() {
    return getJson<News[]>('/news?isPublished=true&_sort=publishedAt&_order=desc')
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
import type { Banner } from '../types'
import { getJson } from './api'
import { getPublishedNews } from './newsService'
import { getCategories, getFeaturedProducts } from './productService'

export async function getHomeData() {
    const [banners, categories, featuredProducts, latestNews] = await Promise.all([
        getJson<Banner[]>('/banners?active=true'),
        getCategories(),
        getFeaturedProducts(),
        getPublishedNews(3),
    ])

    return { banners, categories, featuredProducts, latestNews }
}

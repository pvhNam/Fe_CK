export const FAVORITE_STORAGE_KEY = 'mam-xanh.favorites.v1'
export const FAVORITE_LIMIT = 100

type FavoriteStorage = Pick<Storage, 'getItem' | 'setItem'>

export function normalizeFavorites(value: unknown): number[] {
    if (!Array.isArray(value)) throw new TypeError('Danh sách yêu thích không hợp lệ')
    const ids = value.filter((id): id is number => Number.isSafeInteger(id) && id > 0)
    return [...new Set(ids)].slice(0, FAVORITE_LIMIT)
}

export function readStoredFavorites(storage?: FavoriteStorage): { ids: number[]; error: string | null } {
    if (!storage && typeof window === 'undefined') return {ids: [], error: null}
    try {
        const raw = (storage ?? window.localStorage).getItem(FAVORITE_STORAGE_KEY)
        return {ids: raw === null ? [] : normalizeFavorites(JSON.parse(raw)), error: null}
    } catch {
        return {ids: [], error: 'Không đọc được danh sách yêu thích đã lưu'}
    }
}

export function writeStoredFavorites(ids: readonly number[], storage?: FavoriteStorage): void {
    try {
        (storage ?? window.localStorage).setItem(FAVORITE_STORAGE_KEY, JSON.stringify(normalizeFavorites(ids)))
    } catch {
        throw new Error('Trình duyệt chưa lưu được danh sách yêu thích, danh sách sẽ mất khi tải lại trang')
    }
}
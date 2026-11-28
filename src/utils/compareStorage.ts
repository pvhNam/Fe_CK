export const COMPARE_STORAGE_KEY = 'mam-xanh.compare.v1'
export const COMPARE_LIMIT = 3

type CompareStorage = Pick<Storage, 'getItem' | 'setItem'>

export function normalizeCompareIds(value: unknown): number[] {
    if (!Array.isArray(value)) throw new TypeError('Danh sách so sánh không hợp lệ')
    const ids = value.filter((id): id is number => Number.isSafeInteger(id) && id > 0)
    return [...new Set(ids)].slice(0, COMPARE_LIMIT)
}

export function readStoredCompare(storage?: CompareStorage): { ids: number[]; error: string | null } {
    if (!storage && typeof window === 'undefined') return { ids: [], error: null }
    try {
        const raw = (storage ?? window.localStorage).getItem(COMPARE_STORAGE_KEY)
        return { ids: raw === null ? [] : normalizeCompareIds(JSON.parse(raw)), error: null }
    } catch {
        return { ids: [], error: 'Không đọc được danh sách so sánh đã lưu' }
    }
}

export function writeStoredCompare(ids: readonly number[], storage?: CompareStorage): void {
    try {
        (storage ?? window.localStorage).setItem(COMPARE_STORAGE_KEY, JSON.stringify(normalizeCompareIds(ids)))
    } catch {
        throw new Error('Trình duyệt chưa lưu được danh sách so sánh, danh sách sẽ mất khi tải lại trang')
    }
}

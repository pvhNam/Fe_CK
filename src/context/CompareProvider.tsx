import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {ReactNode} from 'react'
import {COMPARE_LIMIT, COMPARE_STORAGE_KEY, readStoredCompare, writeStoredCompare} from '../utils/compareStorage'
import {CompareContext} from './CompareContext'
import type {CompareContextValue} from './CompareContext'

export default function CompareProvider({children}: { children: ReactNode }) {
    const [initial] = useState(readStoredCompare)
    const [ids, setIds] = useState(initial.ids)
    const [storageError, setStorageError] = useState(initial.error)
    const [notice, setNotice] = useState<string | null>(null)
    const currentIds = useRef(initial.ids)

    useEffect(() => {
        function handleStorage(event: StorageEvent) {
            if (event.key !== null && event.key !== COMPARE_STORAGE_KEY) return
            const stored = readStoredCompare()
            currentIds.current = stored.ids
            setIds(stored.ids)
            setStorageError(stored.error)
        }

        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    const commit = useCallback((next: number[]) => {
        currentIds.current = next
        setIds(next)
        setNotice(null)
        try {
            writeStoredCompare(next)
            setStorageError(null)
        } catch (error) {
            setStorageError(error instanceof Error ? error.message : 'Không lưu được danh sách so sánh')
        }
    }, [])

    const toggleCompare = useCallback((productId: number) => {
        const current = currentIds.current
        if (current.includes(productId)) {
            commit(current.filter((id) => id !== productId))
        } else if (current.length >= COMPARE_LIMIT) {
            setNotice(`Chỉ so sánh tối đa ${COMPARE_LIMIT} cây. Bỏ chọn một cây trước khi thêm cây khác.`)
        } else {
            commit([...current, productId])
        }
    }, [commit])

    const removeCompare = useCallback((productIds: readonly number[]) => {
        commit(currentIds.current.filter((id) => !productIds.includes(id)))
    }, [commit])

    const clearCompare = useCallback(() => commit([]), [commit])
    const clearNotice = useCallback(() => setNotice(null), [])

    const value = useMemo<CompareContextValue>(() => ({
        ids,
        count: ids.length,
        isFull: ids.length >= COMPARE_LIMIT,
        notice,
        storageError,
        isComparing: (productId) => ids.includes(productId),
        toggleCompare,
        removeCompare,
        clearCompare,
        clearNotice,
    }), [ids, notice, storageError, toggleCompare, removeCompare, clearCompare, clearNotice])

    return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

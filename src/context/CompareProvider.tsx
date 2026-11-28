import {useCallback, useEffect, useMemo} from 'react'
import type {ReactNode} from 'react'
import {COMPARE_LIMIT, COMPARE_STORAGE_KEY, readStoredCompare, writeStoredCompare} from '../utils/compareStorage'
import {store, usePurchaseSelector} from '../store/purchaseStore'
import {
    compareCleared,
    compareLoaded,
    compareNoticeCleared,
    compareRemoved,
    compareStorageErrorChanged,
    compareToggled,
} from '../store/compareSlice'
import {CompareContext} from './CompareContext'
import type {CompareContextValue} from './CompareContext'

function saveCompare() {
    try {
        writeStoredCompare(store.getState().compare.ids)
        store.dispatch(compareStorageErrorChanged(null))
    } catch (error) {
        store.dispatch(compareStorageErrorChanged(error instanceof Error ? error.message : 'Không lưu được danh sách so sánh'))
    }
}

export default function CompareProvider({children}: { children: ReactNode }) {
    const {ids, notice, storageError} = usePurchaseSelector((state) => state.compare)

    useEffect(() => {
        function handleStorage(event: StorageEvent) {
            if (event.key !== null && event.key !== COMPARE_STORAGE_KEY) return
            store.dispatch(compareLoaded(readStoredCompare()))
        }

        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    const toggleCompare = useCallback((productId: number) => {
        store.dispatch(compareToggled(productId))
        saveCompare()
    }, [])

    const removeCompare = useCallback((productIds: readonly number[]) => {
        store.dispatch(compareRemoved(productIds))
        saveCompare()
    }, [])

    const clearCompare = useCallback(() => {
        store.dispatch(compareCleared())
        saveCompare()
    }, [])

    const clearNotice = useCallback(() => {
        store.dispatch(compareNoticeCleared())
    }, [])

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

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {ReactNode} from 'react'
import {FAVORITE_LIMIT, FAVORITE_STORAGE_KEY, readStoredFavorites, writeStoredFavorites} from '../utils/favoriteStorage'
import {FavoritesContext} from './FavoritesContext'
import type {FavoritesContextValue} from './FavoritesContext'

export default function FavoritesProvider({children}: { children: ReactNode }) {
    const [initial] = useState(readStoredFavorites)
    const [ids, setIds] = useState(initial.ids)
    const [storageError, setStorageError] = useState(initial.error)
    const currentIds = useRef(initial.ids)

    useEffect(() => {
        function handleStorage(event: StorageEvent) {
            if (event.key !== null && event.key !== FAVORITE_STORAGE_KEY) return
            const stored = readStoredFavorites()
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
        try {
            writeStoredFavorites(next)
            setStorageError(null)
        } catch (error) {
            setStorageError(error instanceof Error ? error.message : 'Không lưu được danh sách yêu thích')
        }
    }, [])

    const toggleFavorite = useCallback((productId: number) => {
        const current = currentIds.current
        commit(current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [productId, ...current].slice(0, FAVORITE_LIMIT))
    }, [commit])

    const removeFavorites = useCallback((productIds: readonly number[]) => {
        commit(currentIds.current.filter((id) => !productIds.includes(id)))
    }, [commit])

    const value = useMemo<FavoritesContextValue>(() => ({
        ids,
        count: ids.length,
        storageError,
        isFavorite: (productId) => ids.includes(productId),
        toggleFavorite,
        removeFavorites,
    }), [ids, storageError, toggleFavorite, removeFavorites])

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}
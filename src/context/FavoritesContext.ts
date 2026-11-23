import {createContext} from 'react'

export type FavoritesContextValue = {
    ids: readonly number[]
    count: number
    storageError: string | null
    isFavorite: (productId: number) => boolean
    toggleFavorite: (productId: number) => void
    removeFavorites: (productIds: readonly number[]) => void
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)
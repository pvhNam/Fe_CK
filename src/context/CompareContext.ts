import {createContext} from 'react'

export type CompareContextValue = {
    ids: readonly number[]
    count: number
    isFull: boolean
    notice: string | null
    storageError: string | null
    isComparing: (productId: number) => boolean
    toggleCompare: (productId: number) => void
    removeCompare: (productIds: readonly number[]) => void
    clearCompare: () => void
    clearNotice: () => void
}

export const CompareContext = createContext<CompareContextValue | undefined>(undefined)

import { useContext } from 'react'
import { CompareContext } from '../context/CompareContext'

export function useCompare() {
    const compare = useContext(CompareContext)
    if (compare === undefined) throw new Error('useCompare phải được sử dụng bên trong CompareProvider')
    return compare
}

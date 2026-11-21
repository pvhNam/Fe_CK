import { useContext } from 'react'
import { FavoritesContext } from '../context/FavoritesContext'

export function useFavorites() {
    const favorites = useContext(FavoritesContext)
    if (favorites === undefined) throw new Error('useFavorites phải được sử dụng bên trong FavoritesProvider')
    return favorites
}
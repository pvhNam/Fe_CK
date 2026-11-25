import {useParams} from 'react-router-dom'

export function useRouteId(): number | null {
    const {id} = useParams<'id'>()
    if (!id || !/^[1-9]\d*$/.test(id)) return null
    const value = Number(id)
    return Number.isSafeInteger(value) ? value : null
}

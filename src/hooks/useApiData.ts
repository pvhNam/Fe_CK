import { useEffect, useState } from 'react'

export function useApiData<T>(load: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null)
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let ignore = false

        void load().then((result) => {
            if (!ignore) setData(result)
        })

        return () => {
            ignore = true
        }
    }, [load, reloadKey])

    function retry() {
        setData(null)
        setReloadKey((key) => key + 1)
    }

    return { data, retry }
}

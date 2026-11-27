const prefix = 'mam-xanh.order-history.v1.'

export function rememberOrder(id: number): boolean {
    try {
        localStorage.setItem(prefix + id, String(id))
        return true
    } catch {
        return false
    }
}

export function readOrderIds(): number[] {
    const ids: number[] = []
    for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index)
        if (!key?.startsWith(prefix)) continue
        const id = Number(key.slice(prefix.length))
        if (Number.isSafeInteger(id) && id > 0 && key === prefix + id) ids.push(id)
    }
    return ids.sort((a, b) => b - a)
}
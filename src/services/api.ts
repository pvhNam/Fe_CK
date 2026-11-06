const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type ApiResult<T> =
    | { ok: true; data: T }
    | { ok: false; status: number; message: string }

function errorMessage(status: number): string {
    if (status === 404) return 'Không tìm thấy dữ liệu.'
    if (status >= 500) return 'Máy chủ đang gặp lỗi, vui lòng thử lại sau.'
    return `Yêu cầu không thành công (mã ${status}).`
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
    let response: Response
    try {
        response = await fetch(`${BASE_URL}${path}`, init)
    } catch {
        return { ok: false, status: 0, message: 'Không kết nối được fake API. Hãy kiểm tra npm run api.' }
    }

    if (!response.ok) {
        return { ok: false, status: response.status, message: errorMessage(response.status) }
    }

    try {
        const data = (await response.json()) as T
        return { ok: true, data }
    } catch {
        return { ok: false, status: response.status, message: 'Dữ liệu trả về không đúng định dạng JSON.' }
    }
}

export function getJson<T>(path: string): Promise<ApiResult<T>> {
    return request<T>(path)
}

export function postJson<T>(path: string, body: unknown): Promise<ApiResult<T>> {
    return request<T>(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}

export function patchJson<T>(path: string, body: unknown): Promise<ApiResult<T>> {
    return request<T>(path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}
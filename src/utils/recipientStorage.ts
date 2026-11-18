import type {Customer} from '../types'
import {createEmptyRecipient} from './recipient'

export const RECIPIENT_STORAGE_KEY = 'mam-xanh.checkout.recipient.v1'

type RecipientStorage = Pick<Storage, 'getItem' | 'setItem'>

export function readRecipientDraft(storage?: RecipientStorage): {customer: Customer; error: string | null} {
    if (!storage && typeof window === 'undefined') {
        return {customer: createEmptyRecipient(), error: null}
    }

    try {
        const raw = (storage ?? window.sessionStorage).getItem(RECIPIENT_STORAGE_KEY)
        if (raw === null) return {customer: createEmptyRecipient(), error: null}

        const value: unknown = JSON.parse(raw)
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new TypeError('Thông tin người nhận đã lưu không hợp lệ.')
        }

        const draft = value as Record<string, unknown>
        if (typeof draft.name !== 'string' || typeof draft.phone !== 'string'
            || typeof draft.region !== 'string' || typeof draft.address !== 'string'
            || (draft.note !== undefined && typeof draft.note !== 'string')) {
            throw new TypeError('Thông tin người nhận đã lưu không hợp lệ.')
        }

        return {
            customer: {
                name: draft.name,
                phone: draft.phone,
                region: draft.region,
                address: draft.address,
                note: draft.note ?? '',
            },
            error: null,
        }
    } catch {
        return {customer: createEmptyRecipient(), error: 'Không đọc được thông tin người nhận'}
    }
}

export function writeRecipientDraft(customer: Customer, storage?: RecipientStorage): void {
    try {
        (storage ?? window.sessionStorage).setItem(RECIPIENT_STORAGE_KEY, JSON.stringify(customer))
    } catch {
        throw new Error('Không lưu được thông tin người nhận. Vui lòng thử lại.')
    }
}
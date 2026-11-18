import type {Customer} from '../types'

export type RecipientField = keyof Required<Customer>
export type RecipientErrors = Partial<Record<RecipientField, string>>

export const RECIPIENT_LIMITS = {
    name: 100,
    phone: 24,
    region: 120,
    address: 300,
    note: 500,
} as const

export function createEmptyRecipient(): Customer {
    return {name: '', phone: '', region: '', address: '', note: ''}
}

export function normalizeRecipient(customer: Customer): Customer {
    return {
        name: customer.name.trim().replace(/\s+/g, ' '),
        phone: customer.phone.trim().replace(/[\s.()-]/g, '').replace(/^\+84/, '0'),
        region: customer.region.trim().replace(/\s+/g, ' '),
        address: customer.address.trim(),
        note: (customer.note ?? '').trim(),
    }
}

export function validateRecipient(customer: Customer): RecipientErrors {
    const recipient = normalizeRecipient(customer)
    const errors: RecipientErrors = {}

    if (!recipient.name) {
        errors.name = 'Vui lòng nhập họ tên người nhận.'
    } else if (recipient.name.length < 2 || !/\p{L}/u.test(recipient.name)) {
        errors.name = 'Họ tên cần có ít nhất 2 ký tự và chứa chữ cái.'
    } else if (recipient.name.length > RECIPIENT_LIMITS.name) {
        errors.name = `Họ tên tối đa ${RECIPIENT_LIMITS.name} ký tự.`
    }

    if (!recipient.phone) {
        errors.phone = 'Vui lòng nhập số điện thoại.'
    } else if (!/^0\d{9}$/.test(recipient.phone)) {
        errors.phone = 'Nhập 10 chữ số bắt đầu bằng 0 hoặc +84 và 9 chữ số.'
    }

    if (!recipient.region) {
        errors.region = 'Vui lòng nhập khu vực nhận hàng.'
    } else if (recipient.region.length > RECIPIENT_LIMITS.region) {
        errors.region = `Khu vực tối đa ${RECIPIENT_LIMITS.region} ký tự.`
    }

    if (!recipient.address) {
        errors.address = 'Vui lòng nhập địa chỉ chi tiết.'
    } else if (recipient.address.length < 5) {
        errors.address = 'Địa chỉ chi tiết cần có ít nhất 5 ký tự.'
    } else if (recipient.address.length > RECIPIENT_LIMITS.address) {
        errors.address = `Địa chỉ chi tiết tối đa ${RECIPIENT_LIMITS.address} ký tự.`
    }

    if ((recipient.note ?? '').length > RECIPIENT_LIMITS.note) {
        errors.note = `Ghi chú tối đa ${RECIPIENT_LIMITS.note} ký tự.`
    }

    return errors
}
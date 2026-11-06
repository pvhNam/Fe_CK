const vndFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})

/** định dạng tiền vnd */
export function formatVND(amount: number): string {
    if (!Number.isFinite(amount)) {
        throw new TypeError('Số tiền cần định dạng phải là số hữu hạn')
    }
    return vndFormatter.format(amount)
}
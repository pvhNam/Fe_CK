const ACCOUNT_PREFIX = 'mam-xanh.account.v1:'
const SESSION_KEY = 'mam-xanh.account-session.v1'
const PASSWORD_ITERATIONS = 600_000

export type AuthUser = {
    name: string
    email: string
}

type StoredAccount = AuthUser & {
    salt: string
    passwordHash: string
}

export class AccountError extends Error {
}

function accountKey(email: string) {
    return ACCOUNT_PREFIX + email.trim().toLowerCase()
}

function readAccount(email: string): StoredAccount | null {
    const raw = localStorage.getItem(accountKey(email))
    if (!raw) return null

    const account: Partial<StoredAccount> | null = JSON.parse(raw)
    if (typeof account?.name !== 'string' || typeof account.email !== 'string'
        || typeof account.salt !== 'string' || !/^[a-f0-9]{32}$/.test(account.salt)
        || typeof account.passwordHash !== 'string' || !/^[a-f0-9]{64}$/.test(account.passwordHash)
        || accountKey(account.email) !== accountKey(email)) {
        throw new AccountError('Không đọc được thông tin tài khoản đã lưu.')
    }
    return {name: account.name, email: account.email, salt: account.salt, passwordHash: account.passwordHash}
}

function toHex(bytes: Uint8Array) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password: string, salt: Uint8Array<ArrayBuffer>) {
    const subtle = globalThis.crypto?.subtle
    if (!subtle) throw new AccountError('Hãy mở trang qua localhost hoặc HTTPS để sử dụng tài khoản.')

    const key = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
    const hash = await subtle.deriveBits(
        {name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PASSWORD_ITERATIONS}, key, 256,
    )
    return toHex(new Uint8Array(hash))
}

export async function registerAccount(name: string, email: string, password: string) {
    const user = {name: name.trim().replace(/\s+/g, ' '), email: email.trim().toLowerCase()}
    if (user.name.length < 2 || user.name.length > 80) {
        throw new AccountError('Họ và tên cần từ 2 đến 80 ký tự.')
    }
    if (password.length < 8 || password.length > 128) {
        throw new AccountError('Mật khẩu cần từ 8 đến 128 ký tự.')
    }

    const salt = globalThis.crypto.getRandomValues(new Uint8Array(16))
    const passwordHash = await hashPassword(password, salt)

    function saveAccount() {
        if (readAccount(user.email)) throw new AccountError('Email này đã được đăng ký.')
        const account: StoredAccount = {...user, salt: toHex(salt), passwordHash}
        localStorage.setItem(accountKey(user.email), JSON.stringify(account))
    }

    if (navigator.locks) {
        await navigator.locks.request(accountKey(user.email), saveAccount)
    } else {
        saveAccount()
    }
    return user
}

export async function authenticateAccount(email: string, password: string): Promise<AuthUser> {
    const account = readAccount(email)
    if (account) {
        const salt = Uint8Array.from(account.salt.match(/../g) ?? [], byte => Number.parseInt(byte, 16))
        if (await hashPassword(password, salt) === account.passwordHash) {
            return {name: account.name, email: account.email}
        }
    }
    throw new AccountError('Email hoặc mật khẩu chưa đúng.')
}

export function readAuthSession(): AuthUser | null {
    try {
        const email = sessionStorage.getItem(SESSION_KEY)
        const account = email ? readAccount(email) : null
        return account ? {name: account.name, email: account.email} : null
    } catch {
        return null
    }
}

export function writeAuthSession(user: AuthUser) {
    sessionStorage.setItem(SESSION_KEY, user.email)
}

export function clearAuthSession() {
    sessionStorage.removeItem(SESSION_KEY)
}

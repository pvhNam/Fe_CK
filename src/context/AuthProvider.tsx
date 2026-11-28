import {useEffect, useState, type ReactNode} from 'react'
import {AuthContext} from './AuthContext'
import {authenticateAccount, clearAuthSession, readAuthSession, writeAuthSession} from '../utils/authStorage'

export default function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState(readAuthSession)

    useEffect(() => {
        function syncSession(event: StorageEvent) {
            if (event.storageArea === localStorage) setUser(readAuthSession())
        }

        window.addEventListener('storage', syncSession)
        return () => window.removeEventListener('storage', syncSession)
    }, [])

    async function login(email: string, password: string) {
        const account = await authenticateAccount(email, password)
        writeAuthSession(account)
        setUser(account)
    }

    function logout() {
        clearAuthSession()
        setUser(null)
    }

    return <AuthContext.Provider value={{user, login, logout}}>{children}</AuthContext.Provider>
}

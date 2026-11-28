import {createContext} from 'react'
import type {AuthUser} from '../utils/authStorage'

type AuthContextValue = {
    user: AuthUser | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

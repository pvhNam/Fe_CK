import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {authenticateAccount, clearAuthSession, writeAuthSession, type AuthUser} from '../utils/authStorage'
import type {AppDispatch, RootState} from './store'

type AuthState = {
    user: AuthUser | null
}

const initialState: AuthState = {user: null}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        sessionChanged(state, action: PayloadAction<AuthUser | null>) {
            state.user = action.payload
        },
    },
})

export const {sessionChanged} = authSlice.actions
export const selectAuthUser = (state: RootState) => state.auth.user

export function login(email: string, password: string) {
    return async (dispatch: AppDispatch) => {
        const user = await authenticateAccount(email, password)
        writeAuthSession(user)
        dispatch(sessionChanged(user))
    }
}

export function logout() {
    return (dispatch: AppDispatch) => {
        clearAuthSession()
        dispatch(sessionChanged(null))
    }
}

export default authSlice.reducer

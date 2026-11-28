import {configureStore} from '@reduxjs/toolkit'
import {readAuthSession} from '../utils/authStorage'
import authReducer, {sessionChanged} from './authSlice'

export const store = configureStore({
    reducer: {auth: authReducer},
    preloadedState: {auth: {user: readAuthSession()}},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

function syncSession(event: StorageEvent) {
    if (event.storageArea === window.localStorage) {
        store.dispatch(sessionChanged(readAuthSession()))
    }
}

window.addEventListener('storage', syncSession)
import.meta.hot?.dispose(() => window.removeEventListener('storage', syncSession))

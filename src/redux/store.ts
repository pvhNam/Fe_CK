import {store} from '../store/purchaseStore'
import {readAuthSession} from '../utils/authStorage'
import {sessionChanged} from './authSlice'

export {store}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

function syncSession(event: StorageEvent) {
    if (event.storageArea === window.localStorage) {
        store.dispatch(sessionChanged(readAuthSession()))
    }
}

window.addEventListener('storage', syncSession)
import.meta.hot?.dispose(() => window.removeEventListener('storage', syncSession))

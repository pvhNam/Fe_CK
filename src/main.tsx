import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './style/index.css'
import App from './App.tsx'
import {Provider} from 'react-redux'
import {store} from './store/purchaseStore'
import CartProvider from './context/CartProvider'
import FavoritesProvider from './context/FavoritesProvider'
import AuthProvider from './context/AuthProvider'
import CompareProvider from './context/CompareProvider'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <CartProvider>
                <FavoritesProvider>
                    <AuthProvider>
                        <CompareProvider>
                            <App/>
                        </CompareProvider>
                    </AuthProvider>
                </FavoritesProvider>
            </CartProvider>
        </Provider>
    </StrictMode>,
)

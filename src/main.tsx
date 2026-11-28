import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './style/index.css'
import App from './App.tsx'
import CartProvider from './context/CartProvider'
import FavoritesProvider from './context/FavoritesProvider'
import AuthProvider from './context/AuthProvider'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CartProvider>
            <FavoritesProvider>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </FavoritesProvider>
        </CartProvider>
    </StrictMode>,
)

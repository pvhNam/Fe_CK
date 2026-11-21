import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './style/index.css'
import App from './App.tsx'
import CartProvider from './context/CartProvider'
import FavoritesProvider from './context/FavoritesProvider'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CartProvider>
            <FavoritesProvider>
                <App/>
            </FavoritesProvider>
        </CartProvider>
    </StrictMode>,
)

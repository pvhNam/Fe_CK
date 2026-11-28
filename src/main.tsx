import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './style/index.css'
import App from './App.tsx'
import CartProvider from './context/CartProvider'
import FavoritesProvider from './context/FavoritesProvider'
import {store} from './redux/store'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <CartProvider>
                <FavoritesProvider>
                    <App/>
                </FavoritesProvider>
            </CartProvider>
        </Provider>
    </StrictMode>,
)

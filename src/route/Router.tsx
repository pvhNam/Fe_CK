import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Layout from './Layout'
import RouteError from './Error'
import HomePage from '../pages/HomePage'
import ProductListPage from '../pages/ProductListPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import NewsListPage from '../pages/NewsListPage'
import NewsDetailPage from '../pages/NewsDetailPage'
import CartPage from '../pages/CartPage'
import CheckoutRecipientPage from '../pages/CheckoutRecipientPage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import CheckoutShippingPage from '../pages/CheckoutShippingPage'
import CheckoutPaymentPage from '../pages/CheckoutPaymentPage'
import OrderConfirmationPage from '../pages/OrderConfirmationPage'
import ProductAdminPage from '../pages/ProductAdminPage'
import NewsAdminPage from '../pages/NewsAdminPage'
import OrderAdminPage from '../pages/OrderAdminPage'
import FavoritesPage from '../pages/FavoritesPage'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="san-pham">
                        <Route index element={<ProductListPage/>}/>
                        <Route path=":id" element={<ProductDetailPage/>}/>
                    </Route>
                    <Route path="tin-tuc">
                        <Route index element={<NewsListPage/>}/>
                        <Route path=":id" element={<NewsDetailPage/>}/>
                    </Route>
                    <Route path="gioi-thieu" element={<AboutPage/>}/>
                    <Route path="lien-he" element={<ContactPage/>}/>
                    <Route path="goc-cham-soc" element={<Navigate to="/#footer-care-title" replace/>}/>
                    <Route path="yeu-thich" element={<FavoritesPage/>}/>
                    <Route path="gio-hang" element={<CartPage/>}/>
                    <Route path="thanh-toan">
                        <Route index element={<CheckoutRecipientPage/>}/>
                        <Route path="giao-hang" element={<CheckoutShippingPage/>}/>
                        <Route path="phuong-thuc-thanh-toan" element={<CheckoutPaymentPage/>}/>
                    </Route>
                    <Route path="don-hang/:id/xac-nhan" element={<OrderConfirmationPage/>}/>
                    <Route path="quan-ly">
                        <Route index element={<Navigate to="san-pham" replace/>}/>
                        <Route path="san-pham" element={<ProductAdminPage/>}/>
                        <Route path="tin-tuc" element={<NewsAdminPage/>}/>
                        <Route path="don-hang" element={<OrderAdminPage/>}/>
                    </Route>
                    <Route path="*" element={<RouteError/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

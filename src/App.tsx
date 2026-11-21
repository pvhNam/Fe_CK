import Header from './components/Header'
import Footer from './components/Footer'
import ContactIcons from './components/ContactIcons'
import './style/App.css'
import HomePage from './pages/HomePage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import NewsListPage from './pages/NewsListPage'
import NewsDetailPage from './pages/NewsDetailPage'
import CartPage from './pages/CartPage'
import CheckoutRecipientPage from './pages/CheckoutRecipientPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CheckoutShippingPage from './pages/CheckoutShippingPage'
import CheckoutPaymentPage from './pages/CheckoutPaymentPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import ProductAdminPage from './pages/ProductAdminPage'

function renderPage() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/'

    if (path === '/') return <HomePage/>
    if (path === '/san-pham') return <ProductListPage/>
    if (path === '/tin-tuc') return <NewsListPage/>
    if (path === '/gioi-thieu') return <AboutPage/>
    if (path === '/lien-he') return <ContactPage/>
    if (path === '/gio-hang') return <CartPage/>
    if (path === '/thanh-toan') return <CheckoutRecipientPage/>
    if (path === '/thanh-toan/giao-hang') return <CheckoutShippingPage />
    if (path === '/thanh-toan/phuong-thuc-thanh-toan') return <CheckoutPaymentPage />
    const confirmation = path.match(/^\/don-hang\/([1-9]\d*)\/xac-nhan$/)
    if (confirmation && Number.isSafeInteger(Number(confirmation[1]))) {
        return <OrderConfirmationPage orderId={Number(confirmation[1])} />
    }
    if (path === '/quan-ly/san-pham') return <ProductAdminPage/>
    const detail = path.match(/^\/(san-pham|tin-tuc)\/([1-9]\d*)$/)
    if (detail) {
        const id = Number(detail[2])
        if (Number.isSafeInteger(id)) {
            return detail[1] === 'san-pham'
                ? <ProductDetailPage key={id} productId={id}/>
                : <NewsDetailPage key={id} newsId={id}/>
        }
    }

    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <h1>Không tìm thấy trang</h1>
                </header>
                <a className="product-page__back" href="/">Về trang chủ</a>
            </div>
        </main>
    )
}

function App() {
    return (
        <div className="app-shell" id="top">
            <Header/>
            {renderPage()}
            <Footer/>
            <ContactIcons/>
        </div>
    )
}

export default App

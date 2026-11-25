import {Link} from 'react-router-dom'

export default function RouteError() {
    return (
        <main className="product-page">
            <div className="product-page__container">
                <header className="product-page__heading">
                    <h1>Không tìm thấy trang</h1>
                </header>
                <Link className="product-page__back" to="/">Về trang chủ</Link>
            </div>
        </main>
    )
}

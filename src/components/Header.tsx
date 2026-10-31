import './Header.css'

function Header(){
    return(
        <header className="header">
            <div className="header-content">
                <a href="#" className="logo">
                    Mầm Xanh
                </a>

                <nav className="menu">
                    <a href="#">Trang chủ</a>
                    <a href="#">Sản phẩm</a>
                    <a href="#">Góc chăm sóc</a>
                    <a href="#">Giới thiệu</a>
                </nav>

                <a href="#" className="cart">
                    Giỏ hàng (0)
                </a>
            </div>
        </header>
    )
}

export default Header
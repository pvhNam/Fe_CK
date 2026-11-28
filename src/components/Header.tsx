import {Link, NavLink, useNavigate, useSearchParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useCallback, useEffect, useRef, useState, type FormEvent} from 'react'
import {useCart} from '../hooks/useCart'
import '../style/Header.css'
import plantLogo from '../assets/images/logo/footer-plant.jpg'
import {useFavorites} from '../hooks/useFavorites'
import {selectAuthUser} from '../redux/authSlice'

type MenuItem = {
    id: string
    label: string
    href: string
    children?: string[]
}

// Thêm hoặc sửa danh mục ở đây
const menuItems: MenuItem[] = [
    {
        id: 'home',
        label: 'Trang chủ',
        href: '/',
    },
    {
        id: 'products',
        label: 'Sản phẩm',
        href: '/san-pham',
    },
    {
        id: 'fruit',
        label: 'Cây ăn quả',
        href: '/san-pham?danhMuc=cay-an-qua',
        children: ['Xoài', 'Chanh', 'Ổi', 'Mít', 'Bưởi'],
    },
    {
        id: 'vegetables',
        label: 'Rau & gia vị',
        href: '/san-pham?danhMuc=rau-gia-vi',
        children: ['Húng quế', 'Bạc hà', 'Tía tô', 'Sả', 'Hương thảo'],
    },
    {
        id: 'flowers',
        label: 'Hoa & cây cảnh',
        href: '/san-pham?danhMuc=hoa-cay-canh',
        children: [
            'Hoa hồng',
            'Hoa giấy',
            'Cẩm tú cầu',
            'Trầu bà',
            'Lưỡi hổ',
        ],
    },
    {
        id: 'news',
        label: 'Tin tức',
        href: '/tin-tuc',
    },
    {
        id: 'care',
        label: 'Góc chăm sóc',
        href: '/goc-cham-soc',
    },
    {
        id: 'about',
        label: 'Giới thiệu',
        href: '/gioi-thieu',
    },
    {
        id: 'contact',
        label: 'Liên hệ',
        href: '/lien-he',
    },
]

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)

    const headerRef = useRef<HTMLElement>(null)

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const keyword = searchParams.get('q') ?? ''
    const {items} = useCart()
    const cartCount = items.length
    const {count: favoriteCount} = useFavorites()
    const user = useSelector(selectAuthUser)

    const closeMenu = useCallback(() => {
        setOpenDropdown(null)
        setMobileMenuOpen(false)
    }, [])

    function searchProducts(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const query = String(new FormData(event.currentTarget).get('q') ?? '').trim()
        closeMenu()
        navigate(query ? `/san-pham?${new URLSearchParams({q: query})}` : '/san-pham')
    }

    // Đóng menu khi bấm ra ngoài hoặc nhấn Escape
    useEffect(() => {
        function handleOutsideClick(event: PointerEvent) {
            if (
                event.target instanceof Node &&
                !headerRef.current?.contains(event.target)
            ) {
                closeMenu()
            }
        }

        function handleEscape(event: KeyboardEvent) {
            const header = headerRef.current

            if (
                event.key !== 'Escape' ||
                !header?.contains(document.activeElement)
            ) {
                return
            }

            const dropdownButton = header.querySelector<HTMLButtonElement>(
                '.header-dropdown-toggle[aria-expanded="true"]',
            )

            setOpenDropdown(null)

            if (dropdownButton) {
                dropdownButton.focus()
            } else {
                header
                    .querySelector<HTMLButtonElement>(
                        '.header-mobile-toggle[aria-expanded="true"]',
                    )
                    ?.focus()

                setMobileMenuOpen(false)
            }
        }

        document.addEventListener('pointerdown', handleOutsideClick)
        document.addEventListener('keydown', handleEscape)
        window.addEventListener('popstate', closeMenu)

        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick)
            document.removeEventListener('keydown', handleEscape)
            window.removeEventListener('popstate', closeMenu)
        }
    }, [closeMenu])

    return (
        <header className="site-header" ref={headerRef} onClick={(event) => {
            if (event.target instanceof Element && event.target.closest('a')) closeMenu()
        }}>

            <div className="header-topbar">
                <div className="header-container header-topbar-inner">
                    <span>Gieo một mầm nhỏ, thêm một niềm vui.</span>
                    <a href="#footer-care-title">Hướng dẫn chăm cây ↗</a>
                </div>
            </div>

            <div className="header-container header-main">
                <Link
                    className="header-brand"
                    to="/"
                    aria-label="Mầm Xanh — Trang chủ"
                >
                    <img src={plantLogo} alt="" width={56} height={56}/>

                    <div className="header-brand-text">
                        <strong>Mầm Xanh</strong>
                        <span>Ươm mầm cho cuộc sống</span>
                    </div>
                </Link>

                <form
                    className="header-search"
                    role="search"
                    action="/san-pham"
                    method="get"
                    onSubmit={searchProducts}
                >
                    <input
                        type="search"
                        name="q"
                        key={keyword}
                        defaultValue={keyword}
                        placeholder="Bạn muốn trồng cây gì?"
                        aria-label="Tìm kiếm cây giống"
                    />

                    <button type="submit" aria-label="Tìm kiếm">
                        <svg className="header-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="10.5" cy="10.5" r="6.5"/>
                            <path d="m16 16 5 5"/>
                        </svg>
                    </button>
                </form>

                <div className="header-actions">
                    <NavLink
                        className="header-action"
                        to={user ? '/tai-khoan' : '/dang-nhap'}
                        aria-label={user ? 'Tài khoản của tôi' : 'Đăng nhập tài khoản'}
                    >
                        <i className="fa-regular fa-user" aria-hidden="true"/>

                        <span className="header-action-label">Tài khoản</span>
                    </NavLink>
                    <NavLink
                        className="header-action"
                        to="/yeu-thich"
                        aria-label={`Cây yêu thích, đã lưu ${favoriteCount} cây`}
                    >
                        <span className="header-cart-icon">
                            <i className="fa-regular fa-heart" aria-hidden="true"/>

                            {favoriteCount > 0 && (
                                <span className="header-cart-count" aria-hidden="true">
                                    {favoriteCount}
                                </span>
                            )}
                        </span>

                        <span className="header-action-label">Yêu thích</span>
                    </NavLink>
                    <NavLink
                        className="header-action"
                        to="/gio-hang"
                        aria-label={`Giỏ hàng có ${cartCount} loại sản phẩm`}
                    >
                        <span className="header-cart-icon">
                            <i className="fa-solid fa-cart-shopping" aria-hidden="true"/>
                            <span className="header-cart-count" aria-hidden="true">{cartCount}</span>
                        </span>

                        <span className="header-action-label">Giỏ hàng</span>
                    </NavLink>
                    <NavLink
                        className="header-action header-order-history"
                        to="/lich-su-don-hang"
                        aria-label="Lịch sử đơn hàng"
                        title="Lịch sử đơn hàng"
                    >
                        <i className="fa-solid fa-clock-rotate-left" aria-hidden="true"/>
                        <span className="header-action-label">Lịch sử</span>
                    </NavLink>

                    <button
                        type="button"
                        className="header-mobile-toggle"
                        aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="header-navigation"
                        onClick={() => {
                            setMobileMenuOpen((current) => !current)
                            setOpenDropdown(null)
                        }}
                    >
                        <svg className="header-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                d={
                                    mobileMenuOpen
                                        ? 'M6 6l12 12M6 18 18 6'
                                        : 'M4 6h16M4 12h16M4 18h16'
                                }
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* MENU ĐIỀU HƯỚNG */}
            <nav
                id="header-navigation"
                className={`header-nav ${mobileMenuOpen ? 'is-open' : ''}`}
                aria-label="Điều hướng chính"
            >
                <div className="header-container">
                    <ul className="header-menu">
                        {menuItems.map((item) => (
                            <li
                                className="header-menu-item"
                                key={item.id}
                                onPointerEnter={(event) => {
                                    if (
                                        item.children &&
                                        event.pointerType === 'mouse' &&
                                        window.innerWidth > 1000
                                    ) {
                                        setOpenDropdown(item.id)
                                    }
                                }}
                                onPointerLeave={(event) => {
                                    if (
                                        event.pointerType === 'mouse' &&
                                        window.innerWidth > 1000
                                    ) {
                                        setOpenDropdown(null)
                                    }
                                }}
                                onBlur={(event) => {
                                    if (!event.currentTarget.contains(event.relatedTarget)) {
                                        setOpenDropdown(null)
                                    }
                                }}
                            >
                                {item.children ? (
                                    <>
                                        <button
                                            type="button"
                                            className="header-menu-link header-dropdown-toggle"
                                            aria-expanded={openDropdown === item.id}
                                            aria-controls={`dropdown-${item.id}`}
                                            onClick={() => {
                                                setOpenDropdown((current) =>
                                                    current === item.id ? null : item.id,
                                                )
                                            }}
                                        >
                                            {item.label}

                                            <svg
                                                className="header-chevron"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path d="m6 9 6 6 6-6"/>
                                            </svg>
                                        </button>

                                        <ul
                                            id={`dropdown-${item.id}`}
                                            className="header-dropdown"
                                            hidden={openDropdown !== item.id}
                                        >
                                            <li>
                                                <Link className="header-dropdown-all" to={item.href}>
                                                    Xem tất cả {item.label.toLowerCase()}
                                                </Link>
                                            </li>

                                            {item.children.map((plantName) => (
                                                <li key={plantName}>
                                                    <Link
                                                        to={`${item.href}&q=${encodeURIComponent(plantName)}`}
                                                    >
                                                        {plantName}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <NavLink
                                        to={item.href}
                                        end={item.href === '/'}
                                        className={({isActive}) => `header-menu-link${isActive ? ' is-active' : ''}`}
                                    >
                                        {item.label}
                                    </NavLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header

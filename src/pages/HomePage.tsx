import '../style/HomePage.css'

import xoaiImage from '../assets/images/products/xoai.jpg'
import chanhImage from '../assets/images/products/chanh.jpg'
import hungQueImage from '../assets/images/products/hung-que.jpg'
import hoaHongImage from '../assets/images/products/hoa-hong.jpg'

const featuredProducts = [
    {
        id: 1,
        name: 'Xoài cát Hòa Lộc',
        price: 65000,
        image: xoaiImage,
    },
    {
        id: 2,
        name: 'Chanh không hạt',
        price: 50000,
        image: chanhImage,
    },
    {
        id: 3,
        name: 'Húng quế',
        price: 15000,
        image: hungQueImage,
    },
    {
        id: 4,
        name: 'Hoa hồng',
        price: 55000,
        image: hoaHongImage,
    },
]

const priceFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
})

function HomePage() {
    return (
        <main className="home-page">
            {/* BANNER */}
            <section className="home-banner">
                <div className="home-container home-banner__inner">
                    <div className="home-banner__content">
                        <p className="home-banner__label">
                            MẦM XANH — ƯƠM MẦM CUỘC SỐNG
                        </p>

                        <h1>
                            Mang một chút xanh
                            <br />
                            về khu vườn của bạn.
                        </h1>

                        <p className="home-banner__description">
                            Khám phá những cây giống ăn quả, rau gia vị và cây cảnh.
                            Cùng Mầm Xanh bắt đầu niềm vui trồng cây từ những mầm nhỏ.
                        </p>

                        <a className="home-button" href="#san-pham-noi-bat">
                            Khám phá cây giống
                        </a>
                    </div>

                    <img
                        className="home-banner__image"
                        src={hungQueImage}
                        alt="Những chậu húng quế xanh"
                        width={600}
                        height={800}
                    />
                </div>
            </section>

            {/* SẢN PHẨM NỔI BẬT */}
            <section
                id="san-pham-noi-bat"
                className="home-featured"
                aria-labelledby="featured-title"
            >
                <div className="home-container">
                    <div className="home-featured__heading">
                        <h2 id="featured-title">Sản phẩm nổi bật</h2>
                        <p>Chọn một mầm xanh cho khu vườn của bạn.</p>
                    </div>

                    <div className="home-product-grid">
                        {featuredProducts.map((product) => (
                            <article className="home-product-card" key={product.id}>
                                <img
                                    className="home-product-card__image"
                                    src={product.image}
                                    alt={product.name}
                                    width={400}
                                    height={300}
                                    loading="lazy"
                                />

                                <div className="home-product-card__content">
                                    <h3>{product.name}</h3>

                                    <p className="home-product-card__price">
                                        {priceFormatter.format(product.price)}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default HomePage
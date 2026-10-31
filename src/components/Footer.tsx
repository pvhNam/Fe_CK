import './Footer.css'
import footerPlant from '../assets/footer-plant.jpg'

const plantCategories = ['Cây giống ăn quả', 'Rau & cây gia vị', 'Hoa & cây cảnh']

const careTips = [
  {
    title: 'Chọn cây cho không gian của bạn',
    content:
      'Quan sát ánh sáng và diện tích nơi trồng, rồi chọn giống cây có nhu cầu phù hợp. Một góc ban công hay khu vườn nhỏ đều có thể bắt đầu từ một mầm xanh.',
  },
  {
    title: 'Tưới nước sao cho vừa đủ?',
    content:
      'Kiểm tra độ ẩm của đất trước khi tưới và dùng chậu có lỗ thoát nước. Điều chỉnh lượng nước theo từng giống cây, thời tiết và môi trường trồng.',
  },
  {
    title: 'Chăm cây giống mới mang về',
    content:
      'Đặt cây ở nơi thoáng, tránh nắng gắt và cho cây thời gian thích nghi. Theo dõi lá, độ ẩm đất và tìm hiểu đặc tính của giống cây trước khi thay chậu hay bón phân.',
  },
]

function Footer() {
  return (
    <footer className="site-footer" aria-label="Thông tin Mầm Xanh">
      <div className="footer-inner">
        <div className="footer-intro">
          <div>
            <p className="footer-eyebrow">Gieo một mầm nhỏ, nuôi một niềm vui</p>
            <h2>Thêm cây xanh, thêm an lành.</h2>
          </div>
          <img className="footer-intro-mark" src={footerPlant} alt="" width={64} height={64} />
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <a className="footer-logo" href="#top" aria-label="Mầm Xanh — về đầu trang">
              <img src={footerPlant} alt="" width={32} height={32} />
              Mầm Xanh
            </a>
            <p>
              Từ những cây giống nhỏ đến một khu vườn đầy sức sống.
              Cùng bạn vun trồng một nhịp sống xanh, mỗi ngày.
            </p>
            <span className="footer-brand-note">
              Một chút xanh cho cuộc sống
            </span>
          </div>

          <section className="footer-categories" aria-labelledby="footer-categories-title">
            <h3 id="footer-categories-title">Vườn nhà có gì?</h3>
            <ul>
              {plantCategories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
            <p>Một mầm cây phù hợp, một khởi đầu thật vui.</p>
          </section>

          <section className="footer-care" aria-labelledby="footer-care-title">
            <h3 id="footer-care-title">Góc nhỏ chăm cây</h3>
            {careTips.map((tip) => (
              <details className="footer-care-tip" key={tip.title}>
                <summary>{tip.title}</summary>
                <p>{tip.content}</p>
              </details>
            ))}
          </section>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Mầm Xanh. Ươm mầm cho cuộc sống.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
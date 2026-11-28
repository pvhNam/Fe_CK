import { Link, useLocation } from 'react-router-dom'
import { useCompare } from '../hooks/useCompare'
import { COMPARE_LIMIT } from '../utils/compareStorage'
import '../style/Compare.css'

function CompareBar() {
    const { count, notice, clearCompare, clearNotice } = useCompare()
    const { pathname } = useLocation()

    if (count === 0 || pathname === '/so-sanh') return null

    return (
        <aside className="compare-bar" aria-label="Cây đang chọn để so sánh">
            <div className="compare-bar__main">
                <p className="compare-bar__count">
                    Đã chọn <strong>{count}/{COMPARE_LIMIT}</strong> cây để so sánh
                </p>
                <div className="compare-bar__actions">
                    <button type="button" className="compare-bar__clear" onClick={clearCompare}>
                        Bỏ chọn hết
                    </button>
                    <Link className="compare-bar__go" to="/so-sanh">
                        So sánh ngay
                    </Link>
                </div>
            </div>
            <p className="compare-bar__notice" role="status">
                {notice && (
                    <>
                        {notice}
                        <button type="button" onClick={clearNotice} aria-label="Đóng thông báo">×</button>
                    </>
                )}
            </p>
        </aside>
    )
}

export default CompareBar

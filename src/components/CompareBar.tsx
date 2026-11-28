import { Link, useLocation } from 'react-router-dom'
import { useCompare } from '../hooks/useCompare'
import { COMPARE_LIMIT } from '../utils/compareStorage'
import '../style/Compare.css'

function CompareBar() {
    const { count, notice, clearCompare, clearNotice } = useCompare()
    const { pathname } = useLocation()

    if (count === 0 || pathname === '/so-sanh') return null

    const canCompare = count >= 2

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
                    {canCompare ? (
                        <Link className="compare-bar__go" to="/so-sanh">
                            So sánh ngay
                        </Link>
                    ) : (
                        <button type="button" className="compare-bar__go" disabled aria-describedby="compare-bar-hint">
                            So sánh ngay
                        </button>
                    )}
                </div>
            </div>
            {!canCompare && (
                <p className="compare-bar__hint" id="compare-bar-hint">
                    Chọn thêm ít nhất 1 cây nữa để so sánh.
                </p>
            )}
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

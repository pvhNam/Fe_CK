import {Link} from 'react-router-dom'
import {purchaseApi, useOrderData} from '../store/purchaseApi'
import {formatVND} from '../utils/currency'
import {DELIVERY_LABELS, PAYMENT_LABELS, formatDateTime} from '../utils/orderDisplay'
import '../style/OrderConfirmationPage.css'

function HistoryEntry({id}: {id: number}) {
    const {data, retry} = useOrderData(id)
    return (
        <article className="order-confirmation__panel">
            <h2><Link to={`/don-hang/${id}/xac-nhan`}>Đơn #{id}</Link></h2>
            {!data && <p role="status">Đang tải đơn hàng…</p>}
            {data && !data.ok && <>
                <p role="alert">{data.status === 404 ? 'Đơn này không còn trên hệ thống.' : data.message}</p>
                <button type="button" onClick={retry}>Tải lại đơn #{id}</button>
            </>}
            {data?.ok && <>
                <p>{formatDateTime(data.data.createdAt)}</p>
                <p>Tổng tiền <strong>{formatVND(data.data.total)}</strong></p>
                <p>Thanh toán · {data.data.paymentMethod?.name} · {PAYMENT_LABELS[data.data.paymentStatus]}</p>
                <p>Giao hàng · {data.data.shippingMethod?.name} · {DELIVERY_LABELS[data.data.deliveryStatus]}</p>
            </>}
        </article>
    )
}

export default function OrderHistoryPage() {
    const {data: ids, isError, refetch} = purchaseApi.useHistoryQuery()
    return (
        <main className="order-confirmation">
            <h1>Lịch sử đơn hàng</h1>
            {isError && <p role="alert">Không đọc được lịch sử đơn. <button onClick={refetch}>Thử lại</button></p>}
            {ids?.length === 0 && <p>Chưa có đơn hàng nào được lưu trên trình duyệt này.</p>}
            {ids?.map(id => <HistoryEntry key={id} id={id}/>)}
            <Link className="order-confirmation__continue" to="/san-pham">Tiếp tục mua sắm</Link>
        </main>
    )
}
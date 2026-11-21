import type { DeliveryStatus, Order } from '../types'
import { DELIVERY_LABELS, formatDateTime } from '../utils/orderDisplay'

const STEPS: DeliveryStatus[] = ['pending', 'preparing', 'shipping', 'delivered']

function OrderProgress({ order }: { order: Order }) {
    const history = order.statusHistory ?? []
    const timeOf = (status: DeliveryStatus) => history.findLast((event) => event.status === status)?.at

    if (order.deliveryStatus === 'cancelled') {
        const at = timeOf('cancelled')
        return (
            <p className="order-progress__cancelled">
                Đơn đã hủy{at ? ` lúc ${formatDateTime(at)}` : ''}.
            </p>
        )
    }

    const current = STEPS.indexOf(order.deliveryStatus)

    return (
        <ol className="order-progress" aria-label="Tiến trình giao hàng">
            {STEPS.map((step, index) => {
                const done = index < current || (index === current && step === 'delivered')
                const active = index === current && !done
                const at = index <= current ? timeOf(step) : undefined

                return (
                    <li
                        key={step}
                        className={done ? 'is-done' : active ? 'is-current' : undefined}
                        aria-current={index === current ? 'step' : undefined}
                    >
                        <span className="order-progress__dot" aria-hidden="true">{done ? '✓' : index + 1}</span>
                        <span className="order-progress__text">
                            <span className="order-progress__label">{DELIVERY_LABELS[step]}</span>
                            {at && <span className="order-progress__time">{formatDateTime(at)}</span>}
                        </span>
                    </li>
                )
            })}
        </ol>
    )
}

export default OrderProgress
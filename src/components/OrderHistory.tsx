import type { OrderStatusEvent } from '../types'
import { DELIVERY_LABELS, formatDateTime } from '../utils/orderDisplay'

function OrderHistory({ history }: { history: OrderStatusEvent[] }) {
    if (history.length === 0) return null

    const events = [...history].reverse()
    const lastHasNote = Boolean(events[0].note)

    return (
        <details className="order-history" open={lastHasNote}>
            <summary>Nhật ký trạng thái ({history.length})</summary>
            <ol>
                {events.map((event, index) => (
                    <li key={`${event.at}-${index}`} className={event.note ? 'is-back' : undefined}>
                        <span className="order-history__status">
                            {event.note ? `Lùi về "${DELIVERY_LABELS[event.status]}"` : DELIVERY_LABELS[event.status]}
                        </span>
                        <span className="order-history__time">{formatDateTime(event.at)}</span>
                        {event.note && <span className="order-history__note">Lý do: {event.note}</span>}
                    </li>
                ))}
            </ol>
        </details>
    )
}

export default OrderHistory
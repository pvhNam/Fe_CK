import {Link} from 'react-router-dom'
import type {ReactNode} from 'react'
import '../style/StatePanel.css'

type StatePanelProps = {
    variant: 'loading' | 'empty' | 'error'
    title?: string
    titleAs?: 'h1' | 'h2'
    children?: ReactNode
    actionLabel?: string
    onAction?: () => void
    actionHref?: string
}

function StatePanel({
                        variant,
                        title,
                        titleAs: Title = 'h2',
                        children,
                        actionLabel,
                        onAction,
                        actionHref
                    }: StatePanelProps) {
    const role = variant === 'error' ? 'alert' : 'status'

    return (
        <div className={`state-panel is-${variant}`} role={role}>
            {variant === 'loading' && <span className="state-panel__spinner" aria-hidden="true"/>}
            {title && <Title className="state-panel__title">{title}</Title>}
            {children && <p className="state-panel__text">{children}</p>}
            {actionLabel && onAction && (
                <button type="button" className="ui-button" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
            {actionLabel && actionHref && !onAction && (
                <Link className="ui-button" to={actionHref}>
                    {actionLabel}
                </Link>
            )}
        </div>
    )
}

export default StatePanel

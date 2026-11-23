import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import '../style/DropdownSelect.css'

export type DropdownGroup = { label: string; options: string[] }

type DropdownSelectProps = {
    id: string
    labelId: string
    value: string
    groups: DropdownGroup[]
    placeholder: string
    invalid?: boolean
    describedBy?: string
    disabled?: boolean
    onChange: (value: string) => void
}

function DropdownSelect({
                            id,
                            labelId,
                            value,
                            groups,
                            placeholder,
                            invalid = false,
                            describedBy,
                            disabled = false,
                            onChange,
                        }: DropdownSelectProps) {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(0)
    const options = groups.flatMap((group) => group.options)
    const listId = `${id}-list`

    useEffect(() => {
        if (!open) return
        document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' })
    }, [open, active, id])

    useEffect(() => {
        if (!open) return
        listRef.current?.focus({ preventScroll: true })
        listRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, [open])

    function openList() {
        const index = options.indexOf(value)
        setActive(index >= 0 ? index : 0)
        setOpen(true)
    }

    function closeList() {
        setOpen(false)
        buttonRef.current?.focus()
    }

    function choose(index: number) {
        onChange(options[index])
        closeList()
    }

    function handleListKey(event: KeyboardEvent<HTMLUListElement>) {
        const last = options.length - 1
        if (event.key === 'ArrowDown') setActive((index) => Math.min(index + 1, last))
        else if (event.key === 'ArrowUp') setActive((index) => Math.max(index - 1, 0))
        else if (event.key === 'Home') setActive(0)
        else if (event.key === 'End') setActive(last)
        else if (event.key === 'Enter' || event.key === ' ') choose(active)
        else if (event.key === 'Escape') closeList()
        else return
        event.preventDefault()
        event.stopPropagation()
    }

    return (
        <div className="dropdown-select">
            <button
                ref={buttonRef}
                id={id}
                type="button"
                className="dropdown-select__button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-labelledby={`${labelId} ${id}-value`}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                disabled={disabled}
                onMouseDown={(event) => {
                    if (open) event.preventDefault()
                }}
                onClick={() => (open ? closeList() : openList())}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                        event.preventDefault()
                        openList()
                    }
                }}
            >
                <span
                    id={`${id}-value`}
                    className={value ? 'dropdown-select__value' : 'dropdown-select__value is-placeholder'}
                >
                    {value || placeholder}
                </span>
            </button>

            <ul
                ref={listRef}
                id={listId}
                role="listbox"
                className={`dropdown-select__list ${open ? 'is-open' : ''}`}
                aria-labelledby={labelId}
                aria-activedescendant={open ? `${id}-option-${active}` : undefined}
                tabIndex={-1}
                onKeyDown={handleListKey}
                onBlur={(event) => {
                    if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) setOpen(false)
                }}
            >
                {groups.map((group, groupIndex) => (
                    <li key={group.label} role="presentation">
                        <span className="dropdown-select__group" id={`${id}-group-${groupIndex}`}>
                            {group.label}
                        </span>
                        <ul role="group" aria-labelledby={`${id}-group-${groupIndex}`}>
                            {group.options.map((option) => {
                                const index = options.indexOf(option)
                                return (
                                    <li
                                        key={option}
                                        id={`${id}-option-${index}`}
                                        role="option"
                                        aria-selected={option === value}
                                        className={index === active ? 'is-active' : undefined}
                                        onMouseMove={() => setActive(index)}
                                        onClick={() => choose(index)}
                                    >
                                        {option}
                                    </li>
                                )
                            })}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DropdownSelect
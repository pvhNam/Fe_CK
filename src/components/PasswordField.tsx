import {useState} from 'react'

type PasswordFieldProps = {
    name: string
    label: string
    autoComplete: 'current-password' | 'new-password'
    minLength?: number
    hint?: string
}

export default function PasswordField({name, label, autoComplete, minLength, hint}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="auth-field">
            <label htmlFor={name}>{label}</label>
            <div className="auth-password">
                <input
                    id={name}
                    name={name}
                    type={visible ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    minLength={minLength}
                    maxLength={128}
                    aria-describedby={hint ? `${name}-hint` : undefined}
                    required
                />
                <button
                    type="button"
                    aria-controls={name}
                    aria-label={`${visible ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`}
                    onClick={() => setVisible(current => !current)}
                >
                    {visible ? 'Ẩn' : 'Hiện'}
                </button>
            </div>
            {hint && <p id={`${name}-hint`} className="auth-hint">{hint}</p>}
        </div>
    )
}

import {useState, type FormEvent} from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import AuthCard from '../components/AuthCard'
import PasswordField from '../components/PasswordField'
import {selectAuthUser} from '../redux/authSlice'
import {AccountError, registerAccount} from '../utils/authStorage'

export default function RegisterPage() {
    const user = useSelector(selectAuthUser)
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    if (user) return <Navigate to="/tai-khoan" replace/>

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (busy) return
        const form = new FormData(event.currentTarget)
        const password = String(form.get('password'))
        if (password !== form.get('confirmPassword')) {
            setError('Mật khẩu nhập lại chưa khớp.')
            event.currentTarget.querySelector<HTMLInputElement>('[name="confirmPassword"]')?.focus()
            return
        }

        setError('')
        setBusy(true)
        try {
            const account = await registerAccount(String(form.get('name')), String(form.get('email')), password)
            navigate('/dang-nhap', {replace: true, state: {registeredEmail: account.email}})
        } catch (cause) {
            setError(cause instanceof AccountError ? cause.message : 'Chưa thể tạo tài khoản. Vui lòng thử lại.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <AuthCard title="Tạo tài khoản">
            <form className="auth-form" method="post" onSubmit={submit}>
                <fieldset className="auth-fields" disabled={busy}>
                    <div className="auth-field">
                        <label htmlFor="register-name">Họ và tên</label>
                        <input id="register-name" name="name" autoComplete="name" minLength={2} maxLength={80}
                               required/>
                    </div>
                    <div className="auth-field">
                        <label htmlFor="register-email">Email</label>
                        <input id="register-email" name="email" type="email" autoComplete="username" maxLength={254}
                               required/>
                    </div>
                    <PasswordField name="password" label="Mật khẩu" autoComplete="new-password"
                                   minLength={8} hint="Dùng ít nhất 8 ký tự."/>
                    <PasswordField name="confirmPassword" label="Nhập lại mật khẩu" autoComplete="new-password"
                                   minLength={8}/>
                </fieldset>
                {error && <p className="auth-feedback is-error" role="alert">{error}</p>}
                <button className="ui-button auth-submit" type="submit" disabled={busy}>
                    {busy ? 'Đang tạo tài khoản…' : 'Đăng ký'}
                </button>
            </form>
            <p className="auth-switch">Bạn đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link></p>
        </AuthCard>
    )
}

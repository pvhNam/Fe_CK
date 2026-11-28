import {useState, type FormEvent} from 'react'
import {Link, Navigate, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import AuthCard from '../components/AuthCard'
import PasswordField from '../components/PasswordField'
import {login, selectAuthUser} from '../redux/authSlice'
import type {AppDispatch} from '../redux/store'
import {AccountError} from '../utils/authStorage'

export default function LoginPage() {
    const user = useSelector(selectAuthUser)
    const dispatch = useDispatch<AppDispatch>()
    const {state} = useLocation()
    const registeredEmail = typeof state?.registeredEmail === 'string' ? state.registeredEmail : ''
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    if (user) return <Navigate to="/tai-khoan" replace/>

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (busy) return
        const form = new FormData(event.currentTarget)
        setError('')
        setBusy(true)
        try {
            await dispatch(login(String(form.get('email')), String(form.get('password'))))
        } catch (cause) {
            setError(cause instanceof AccountError ? cause.message : 'Chưa thể đăng nhập. Vui lòng thử lại.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <AuthCard title="Đăng nhập">
            {registeredEmail &&
                <p className="auth-feedback" role="status">Tạo tài khoản thành công. Bạn có thể đăng nhập ngay.</p>}
            <form className="auth-form" method="post" onSubmit={submit}>
                <fieldset className="auth-fields" disabled={busy}>
                    <div className="auth-field">
                        <label htmlFor="login-email">Email</label>
                        <input id="login-email" name="email" type="email" autoComplete="username"
                               defaultValue={registeredEmail} maxLength={254} required/>
                    </div>
                    <PasswordField name="password" label="Mật khẩu" autoComplete="current-password"/>
                </fieldset>
                {error && <p className="auth-feedback is-error" role="alert">{error}</p>}
                <button className="ui-button auth-submit" type="submit" disabled={busy}>
                    {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
                </button>
            </form>
            <p className="auth-switch">Bạn chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link></p>
        </AuthCard>
    )
}

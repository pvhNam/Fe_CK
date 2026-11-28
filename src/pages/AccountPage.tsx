import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import {logout, selectAuthUser} from '../redux/authSlice'
import type {AppDispatch} from '../redux/store'

export default function AccountPage() {
    const user = useSelector(selectAuthUser)
    const dispatch = useDispatch<AppDispatch>()
    const [error, setError] = useState('')

    if (!user) return null

    function endSession() {
        try {
            dispatch(logout())
        } catch {
            setError('Chưa thể đăng xuất. Vui lòng thử lại.')
        }
    }

    return (
        <AuthCard title="Tài khoản của tôi">
            <dl className="auth-profile">
                <div>
                    <dt>Họ và tên</dt>
                    <dd>{user.name}</dd>
                </div>
                <div>
                    <dt>Email</dt>
                    <dd>{user.email}</dd>
                </div>
            </dl>
            {error && <p className="auth-feedback is-error" role="alert">{error}</p>}
            <div className="auth-profile__actions">
                <Link className="ui-button" to="/san-pham">Tiếp tục mua sắm</Link>
                <button className="auth-logout" type="button" onClick={endSession}>Đăng xuất</button>
            </div>
        </AuthCard>
    )
}

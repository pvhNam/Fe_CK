import type {ReactNode} from 'react'
import '../style/AuthPage.css'

export default function AuthCard({title, children}: { title: string; children: ReactNode }) {
    return (
        <main className="auth-page">
            <section className="auth-card" aria-labelledby="auth-title">
                <div className="auth-card__photo" aria-hidden="true">
                    <img src="/images/products/hoa-hong.jpg" alt="" width={1080} height={1920}/>
                </div>
                <div className="auth-card__body">
                    <h1 id="auth-title">{title}</h1>
                    {children}
                </div>
            </section>
        </main>
    )
}

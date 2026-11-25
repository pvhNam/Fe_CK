import {useLayoutEffect} from 'react'
import {Outlet, useLocation, useNavigationType} from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ContactIcons from '../components/ContactIcons'
import '../style/App.css'

export default function Layout() {
    const location = useLocation()
    const navigationType = useNavigationType()

    useLayoutEffect(() => {
        if (!location.hash) {
            if (navigationType !== 'POP') window.scrollTo(0, 0)
            return
        }

        const id = location.hash.slice(1)
        const scrollToSection = () => document.getElementById(id)?.scrollIntoView()
        scrollToSection()

        // Danh sách từ API có thể đẩy mục đang đọc xuống sau lần cuộn đầu tiên.
        const observer = new ResizeObserver(scrollToSection)
        observer.observe(document.body)
        const controller = new AbortController()

        function stopFollowing() {
            observer.disconnect()
            controller.abort()
        }

        for (const event of ['wheel', 'pointerdown', 'keydown']) {
            window.addEventListener(event, stopFollowing, {passive: true, signal: controller.signal})
        }
        return stopFollowing
    }, [location, navigationType])

    return (
        <div className="app-shell" id="top">
            <Header/>
            <Outlet/>
            <Footer/>
            <ContactIcons/>
        </div>
    )
}

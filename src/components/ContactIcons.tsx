import '../style/ContactIcons.css'

function ContactIcons() {
    return (
        <div className="contact-icons" aria-hidden="true">
            <span className="contact-icon contact-icon-phone">
                <svg viewBox="0 0 24 24">
                    <path
                        d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2
                        a1 1 0 0 1 1-.24c1.1.36 2.3.55 3.6.55
                        a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1
                        C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5
                        a1 1 0 0 1 1 1c0 1.3.19 2.5.55 3.6
                        a1 1 0 0 1-.25 1z"
                    />
                </svg>
            </span>

            <span className="contact-icon contact-icon-zalo">
                <svg viewBox="0 0 48 48">
                    <path
                        fill="#ffffff"
                        d="M24 5C12.4 5 4 12.4 4 22
                        c0 5.6 2.8 10.2 7.4 13.3L9 43l9.7-4.2
                        c1.7.4 3.5.6 5.3.6
                        11.6 0 20-7.4 20-17S35.6 5 24 5Z"
                    />
                    <text
                        x="24"
                        y="27"
                        textAnchor="middle"
                        fill="#0068ff"
                        fontFamily="Arial, sans-serif"
                        fontSize="14"
                        fontWeight="700"
                    >
                        Zalo
                    </text>
                </svg>
            </span>

            <span className="contact-icon contact-icon-facebook">
                <svg viewBox="0 0 24 24">
                    <path
                        d="M14 8V6.5C14 5.6 14.6 5 15.5 5H18V1
                        h-3.2C11.8 1 10 3 10 6v2H7v4h3v11h4V12
                        h3.4l.6-4H14Z"
                    />
                </svg>
            </span>
        </div>
    )
}

export default ContactIcons

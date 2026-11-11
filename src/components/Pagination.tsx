import '../style/Pagination.css'

type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

    return (
        <nav className="pagination" aria-label="Phân trang sản phẩm">
            <button
                type="button"
                className="pagination__button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ‹ Trước
            </button>

            {pages.map((page) => (
                <button
                    type="button"
                    key={page}
                    className={`pagination__button ${page === currentPage ? 'is-active' : ''}`}
                    onClick={() => onPageChange(page)}
                    aria-label={`Trang ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                className="pagination__button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Sau ›
            </button>
        </nav>
    )
}

export default Pagination
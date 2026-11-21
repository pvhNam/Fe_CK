import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useApiData } from '../hooks/useApiData'
import { compareNewsByNewest, createNews, getNews, updateNews } from '../services/newsService'
import type { News, NewNews } from '../types'
import '../style/ProductListPage.css'
import '../style/NewsAdminPage.css'

const vietnamDate = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    dateStyle: 'short',
    timeStyle: 'short',
})

function displayDate(timestamp: string) {
    const time = Date.parse(timestamp)
    return Number.isFinite(time) ? vietnamDate.format(time) : 'Chưa có ngày đăng'
}

function toDateInput(timestamp: string) {
    const time = Date.parse(timestamp)
    if (!Number.isFinite(time)) return ''
    // datetime-local cần giờ trên đồng hồ Việt Nam (UTC+7), kể cả khi máy dùng múi giờ khác.
    return new Date(time + 7 * 60 * 60 * 1000).toISOString().slice(0, 16)
}

function isImagePath(value: string) {
    return /^\/[^/\\]/.test(value) || (/^https?:\/\//i.test(value) && URL.canParse(value))
}

function changedFields(article: News, draft: NewNews) {
    const changes: Partial<NewNews> = {}
    for (const key of ['title', 'summary', 'imageUrl', 'publishedAt', 'content'] as const) {
        if (article[key] !== draft[key]) changes[key] = draft[key]
    }
    if (article.isPublished !== draft.isPublished) changes.isPublished = draft.isPublished
    return changes
}

type EditorProps = {
    article: News | null
    onClose: () => void
    onSaved: (article: News) => void
}

function NewsEditor({ article, onClose, onSaved }: EditorProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [initialDate] = useState(() => toDateInput(article?.publishedAt ?? new Date().toISOString()))
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const dialog = dialogRef.current
        dialog?.showModal()
        return () => dialog?.close()
    }, [])

    function closeEditor() {
        dialogRef.current?.close()
        onClose()
    }

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (saving) return

        const fields = new FormData(event.currentTarget)
        const text = (name: string) => String(fields.get(name) ?? '').trim()
        const dateInput = text('publishedAt')
        const draft: NewNews = {
            title: text('title'),
            summary: text('summary'),
            content: text('content'),
            imageUrl: text('imageUrl'),
            publishedAt: article && dateInput === initialDate
                ? article.publishedAt
                : `${dateInput}:00+07:00`,
            isPublished: fields.has('isPublished'),
        }
        if (!draft.title || !draft.summary || !draft.content) {
            setError('Hãy nhập tiêu đề, tóm tắt và nội dung bài viết.')
            return
        }
        if (!isImagePath(draft.imageUrl)) {
            setError('Hãy nhập đường dẫn ảnh bắt đầu bằng / hoặc một địa chỉ http, https hợp lệ.')
            return
        }
        if (!Number.isFinite(Date.parse(draft.publishedAt))) {
            setError('Hãy chọn ngày và giờ đăng hợp lệ.')
            return
        }

        const changes = article ? changedFields(article, draft) : draft
        if (Object.keys(changes).length === 0) {
            closeEditor()
            return
        }
        setSaving(true)
        setError('')
        const result = article ? await updateNews(article.id, changes) : await createNews(draft)
        if (!result.ok) {
            setSaving(false)
            setError(result.status === 404
                ? 'Bài viết này không còn trong danh sách. Hãy đóng biểu mẫu và tải lại trang.'
                : 'Chưa lưu được bài viết. Bạn có thể thử lưu lại.')
            return
        }
        dialogRef.current?.close()
        onSaved(result.data)
    }

    return (
        <dialog ref={dialogRef} className="news-editor" aria-labelledby="news-editor-title"
            onCancel={(event) => {
                event.preventDefault()
                if (!saving) closeEditor()
            }}>
            <h2 id="news-editor-title">{article ? 'Sửa tin tức' : 'Thêm tin tức'}</h2>
            <form onSubmit={save}>
                <fieldset disabled={saving} className="news-editor__fields">
                    <label>
                        Tiêu đề
                        <input name="title" defaultValue={article?.title} required />
                    </label>
                    <label>
                        Tóm tắt
                        <textarea name="summary" rows={2} defaultValue={article?.summary} required />
                    </label>
                    <div className="news-editor__meta">
                        <label>
                            Đường dẫn ảnh bìa
                            <input name="imageUrl" defaultValue={article?.imageUrl}
                                placeholder="/images/products/xoai.jpg" required />
                        </label>
                        <label>
                            Ngày đăng (giờ Việt Nam)
                            <input type="datetime-local" name="publishedAt" defaultValue={initialDate} required />
                        </label>
                    </div>
                    <label>
                        Nội dung bài viết
                        <textarea name="content" rows={5} defaultValue={article?.content} required />
                    </label>
                    <label className="news-editor__visibility">
                        <input type="checkbox" name="isPublished" defaultChecked={article?.isPublished ?? false} />
                        Xuất bản bài viết
                    </label>
                </fieldset>
                {error && <p className="news-admin__feedback is-error" role="alert">{error}</p>}
                <div className="news-editor__actions">
                    <button type="button" className="news-admin__button" disabled={saving} onClick={closeEditor}>Hủy</button>
                    <button type="submit" className="news-admin__button is-primary" disabled={saving}>
                        {saving ? 'Đang lưu…' : 'Lưu bài viết'}
                    </button>
                </div>
            </form>
        </dialog>
    )
}

function NewsAdminPage() {
    const { data, setData, retry } = useApiData(getNews)
    const [editor, setEditor] = useState<News | 'new' | null>(null)
    const [pendingId, setPendingId] = useState<number | null>(null)
    const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null)
    const articles = data?.ok ? [...data.data].sort(compareNewsByNewest) : []
    const busy = pendingId !== null

    function openEditor(article: News | 'new') {
        setNotice(null)
        setEditor(article)
    }

    function showSaved(saved: News, message: string) {
        setData((current) => {
            if (!current?.ok) return current
            return { ok: true, data: [...current.data.filter((item) => item.id !== saved.id), saved] }
        })
        setNotice({ text: message })
    }

    async function togglePublished(article: News) {
        if (busy) return
        setPendingId(article.id)
        setNotice(null)
        const result = await updateNews(article.id, { isPublished: !article.isPublished })
        setPendingId(null)
        if (!result.ok) {
            setNotice({ text: 'Chưa đổi được trạng thái bài viết. Vui lòng thử lại.', error: true })
            return
        }
        showSaved(result.data, `Đã ${result.data.isPublished ? 'hiện' : 'ẩn'} bài “${result.data.title}”.`)
    }

    return (
        <main className="product-page news-admin">
            <div className="product-page__container">
                <a className="product-page__back" href="/quan-ly/san-pham">← Quản lý cây giống</a>
                <header className="product-page__heading">
                    <h1>Quản lý tin tức</h1>
                    <div className="news-admin__actions">
                        <a href="/tin-tuc">Xem trang tin tức →</a>
                        <button type="button" className="news-admin__button is-primary"
                            disabled={!data?.ok || busy} onClick={() => openEditor('new')}>Thêm tin</button>
                    </div>
                </header>

                {notice && <p className={`news-admin__feedback${notice.error ? ' is-error' : ''}`}
                    role={notice.error ? 'alert' : 'status'}>{notice.text}</p>}
                {data === null && <p className="product-page__status" role="status">Đang tải tin tức…</p>}
                {data && !data.ok && (
                    <div className="product-page__status is-error" role="alert">
                        <p>Chưa tải được danh sách bài viết.</p>
                        <button type="button" onClick={retry}>Thử lại</button>
                    </div>
                )}
                {data?.ok && (articles.length === 0 ? (
                    <p className="product-page__status">Chưa có bài viết. Chọn “Thêm tin” để viết bài đầu tiên.</p>
                ) : (
                    <div className="news-admin__panel">
                        <table className="news-admin__table" aria-label="Danh sách bài viết">
                            <thead>
                                <tr>
                                    <th scope="col">Bài viết</th>
                                    <th scope="col" aria-sort="descending">Ngày đăng</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map((article) => (
                                    <tr key={article.id}>
                                        <th scope="row">
                                            <div className="news-admin__article">
                                                <img src={article.imageUrl} alt="" width={60} height={48} loading="lazy" />
                                                {article.isPublished
                                                    ? <a href={`/tin-tuc/${article.id}`}>{article.title}</a>
                                                    : <span>{article.title}</span>}
                                            </div>
                                        </th>
                                        <td><time dateTime={article.publishedAt}>
                                            {displayDate(article.publishedAt)}
                                        </time></td>
                                        <td><span className={`news-admin__badge${article.isPublished ? ' is-published' : ''}`}>
                                            {article.isPublished ? 'Đã xuất bản' : 'Đã ẩn'}
                                        </span></td>
                                        <td>
                                            <div className="news-admin__actions">
                                                <button type="button" className="news-admin__button" disabled={busy}
                                                    aria-label={`Sửa tin ${article.title}`} onClick={() => openEditor(article)}>Sửa</button>
                                                <button type="button" className="news-admin__button" disabled={busy}
                                                    aria-label={`${article.isPublished ? 'Ẩn' : 'Hiện'} tin ${article.title}`}
                                                    onClick={() => togglePublished(article)}>
                                                    {pendingId === article.id ? 'Đang lưu…' : article.isPublished ? 'Ẩn tin' : 'Hiện tin'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            {editor !== null && (
                <NewsEditor article={editor === 'new' ? null : editor} onClose={() => setEditor(null)}
                    onSaved={(saved) => {
                        setEditor(null)
                        showSaved(saved, `Đã ${editor === 'new' ? 'thêm' : 'cập nhật'} bài “${saved.title}”.`)
                    }} />
            )}
        </main>
    )
}

export default NewsAdminPage

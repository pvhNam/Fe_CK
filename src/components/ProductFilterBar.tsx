import type { Category } from '../types'
import {
    PRICE_RANGES,
    SORT_OPTIONS,
    hasActiveFilters,
    type PriceRangeId,
    type ProductFilterValues,
    type SortOrder,
} from '../utils/productFilters'
import '../style/ProductFilterBar.css'

type ProductFilterBarProps = {
    filters: ProductFilterValues
    categories: Category[]
    onChange: (filters: ProductFilterValues) => void
    onReset: () => void
}

function ProductFilterBar({ filters, categories, onChange, onReset }: ProductFilterBarProps) {
    return (
        <section className="filter-bar" aria-label="Bộ lọc sản phẩm">
            <label className="filter-bar__field filter-bar__field--search">
                <span>Tìm theo tên</span>
                <input
                    type="search"
                    value={filters.keyword}
                    placeholder="Ví dụ: xoài, húng quế"
                    onChange={(event) => onChange({ ...filters, keyword: event.target.value })}
                />
            </label>

            <label className="filter-bar__field">
                <span>Danh mục</span>
                <select
                    value={filters.categoryId ?? ''}
                    onChange={(event) =>
                        onChange({
                            ...filters,
                            categoryId: event.target.value === '' ? null : Number(event.target.value),
                        })
                    }
                >
                    <option value="">Tất cả</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </label>

            <label className="filter-bar__field">
                <span>Khoảng giá</span>
                <select
                    value={filters.priceRange}
                    onChange={(event) =>
                        onChange({ ...filters, priceRange: event.target.value as PriceRangeId })
                    }
                >
                    {PRICE_RANGES.map((range) => (
                        <option key={range.id} value={range.id}>
                            {range.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="filter-bar__field">
                <span>Sắp xếp</span>
                <select
                    value={filters.sort}
                    onChange={(event) => onChange({ ...filters, sort: event.target.value as SortOrder })}
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>

            <button
                type="button"
                className="filter-bar__reset"
                onClick={onReset}
                disabled={!hasActiveFilters(filters)}
            >
                Xóa bộ lọc
            </button>
        </section>
    )
}

export default ProductFilterBar
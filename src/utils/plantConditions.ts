import type { CareLevel, Sunlight } from '../types'

export const SUNLIGHT_OPTIONS: { id: Sunlight; label: string }[] = [
    { id: 'full', label: 'Ưa nắng trực tiếp' },
    { id: 'partial', label: 'Nắng nhẹ, nắng sáng' },
    { id: 'shade', label: 'Chịu bóng râm' },
]

export const CARE_LEVEL_OPTIONS: { id: CareLevel; label: string }[] = [
    { id: 'easy', label: 'Dễ chăm' },
    { id: 'medium', label: 'Trung bình' },
    { id: 'hard', label: 'Cần chăm kỹ' },
]

export function sunlightLabel(sunlight: Sunlight): string {
    return SUNLIGHT_OPTIONS.find((option) => option.id === sunlight)?.label ?? 'Chưa cập nhật'
}

export function careLevelLabel(careLevel: CareLevel): string {
    return CARE_LEVEL_OPTIONS.find((option) => option.id === careLevel)?.label ?? 'Chưa cập nhật'
}

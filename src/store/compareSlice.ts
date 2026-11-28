import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {COMPARE_LIMIT, readStoredCompare} from '../utils/compareStorage'

type CompareState = {
    ids: number[]
    storageError: string | null
    notice: string | null
}

function initialCompare(): CompareState {
    const stored = readStoredCompare()
    return {ids: stored.ids, storageError: stored.error, notice: null}
}

const compareSlice = createSlice({
    name: 'compare',
    initialState: initialCompare,
    reducers: {
        compareLoaded: (state, action: PayloadAction<ReturnType<typeof readStoredCompare>>) => {
            state.ids = action.payload.ids
            state.storageError = action.payload.error
        },
        compareToggled: (state, action: PayloadAction<number>) => {
            const id = action.payload
            if (state.ids.includes(id)) {
                state.ids = state.ids.filter((item) => item !== id)
                state.notice = null
            } else if (state.ids.length >= COMPARE_LIMIT) {
                state.notice = `Chỉ so sánh tối đa ${COMPARE_LIMIT} cây. Bỏ chọn một cây trước khi thêm cây khác.`
            } else {
                state.ids.push(id)
                state.notice = null
            }
        },
        compareRemoved: (state, action: PayloadAction<readonly number[]>) => {
            state.ids = state.ids.filter((id) => !action.payload.includes(id))
            state.notice = null
        },
        compareCleared: (state) => {
            state.ids = []
            state.notice = null
        },
        compareNoticeCleared: (state) => {
            state.notice = null
        },
        compareStorageErrorChanged: (state, action: PayloadAction<string | null>) => {
            state.storageError = action.payload
        },
    },
})

export const {
    compareLoaded,
    compareToggled,
    compareRemoved,
    compareCleared,
    compareNoticeCleared,
    compareStorageErrorChanged,
} = compareSlice.actions

export const compareReducer = compareSlice.reducer

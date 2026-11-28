import {configureStore, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {useSelector} from 'react-redux'
import {readStoredCart} from '../utils/cartStorage'
import {readRecipientDraft} from '../utils/recipientStorage'
import {readPaymentDraft, readShippingMethodId, type PaymentDraft} from '../utils/checkoutStorage'
import {purchaseApi} from './purchaseApi'
import {compareReducer} from './compareSlice'

const cartSlice = createSlice({
    name: 'cart',
    initialState: readStoredCart,
    reducers: {
        cartLoaded: (_, action: PayloadAction<ReturnType<typeof readStoredCart>>) => action.payload,
        cartErrorChanged: (state, action: PayloadAction<string | null>) => {state.error = action.payload},
    },
})

function checkoutDraft() {
    return {
        recipient: readRecipientDraft(), shippingId: readShippingMethodId(),
        payment: readPaymentDraft(), coupon: '',
    }
}

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: checkoutDraft,
    reducers: {
        recipientChanged: (state, action: PayloadAction<ReturnType<typeof readRecipientDraft>>) => {state.recipient = action.payload},
        shippingChanged: (state, action: PayloadAction<number>) => {state.shippingId = action.payload},
        paymentChanged: (state, action: PayloadAction<PaymentDraft | null>) => {state.payment = action.payload},
        couponChanged: (state, action: PayloadAction<string>) => {state.coupon = action.payload},
        checkoutReloaded: (_, action: PayloadAction<ReturnType<typeof checkoutDraft>>) => action.payload,
    },
})

export const {cartLoaded, cartErrorChanged} = cartSlice.actions
export const {recipientChanged, shippingChanged, paymentChanged, couponChanged, checkoutReloaded} = checkoutSlice.actions
export {checkoutDraft}
export const store = configureStore({
    reducer: {cart: cartSlice.reducer, checkout: checkoutSlice.reducer, compare: compareReducer, [purchaseApi.reducerPath]: purchaseApi.reducer},
    middleware: defaults => defaults().concat(purchaseApi.middleware),
})
export const usePurchaseSelector = useSelector.withTypes<ReturnType<typeof store.getState>>()

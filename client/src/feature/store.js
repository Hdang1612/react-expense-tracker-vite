// store.js
import { configureStore } from '@reduxjs/toolkit'
import transactionReducer from './transactionSlice'
import modalReducer from './modalSlice'
import authReducer from './authSlice'
const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    modal: modalReducer,
    auth: authReducer,
  },
})

export default store

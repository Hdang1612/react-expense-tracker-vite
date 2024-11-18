// store.js
import { configureStore } from '@reduxjs/toolkit'
import transactionReducer from './transactionSlice'
import modalReducer from './modalSlice'
const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    modal: modalReducer,
  },
})

export default store

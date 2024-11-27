import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isShow: false,
  title: "",
  transactionData: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.isShow = action.payload;
    },
    setModalTitle: (state, action) => {
      state.title = action.payload;
    },
    setTransactionData: (state, action) => {
      state.transactionData = action.payload;
    },
    resetTransactionData: (state) => {
      state.transactionData = null;
    },
  },
});

export const {
  toggleModal,
  setTransactionData,
  setModalTitle,
  resetTransactionData,
} = modalSlice.actions;

export default modalSlice.reducer;

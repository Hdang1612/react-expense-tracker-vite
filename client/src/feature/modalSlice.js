import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTransactionById } from "../services/transactionServices";

export const setTransactionData = createAsyncThunk(
  "modal/setTransactionData",
  async (data) => {
    try {
      if (data) {
        const res = await fetchTransactionById(data.id);
        return res.transaction;
      }
      return null;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  },
);

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
    resetTransactionData: (state) => {
      state.transactionData = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(setTransactionData.fulfilled, (state, action) => {
        state.transactionData = action.payload;
      })
      .addCase(setTransactionData.rejected, () => {
        console.log("failed");
      });
  },
});

export const { toggleModal, setModalTitle, resetTransactionData } =
  modalSlice.actions;

export default modalSlice.reducer;

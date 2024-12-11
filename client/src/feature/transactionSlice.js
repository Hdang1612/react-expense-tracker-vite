import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchAllTransaction,
  addTransaction,
  updateTransaction,
  removeTransaction,
  filterByPeriodTime
} from "../services/transactionServices.js";
import { showErrorToast, showSuccessToast } from "../utils/Toaste.js";

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async () => {
    try {
      const res = await fetchAllTransaction();
      return res.data;
    } catch (error) {
      return (error.message);
    }
  },
);

export const groupTransaction = createAsyncThunk(
  "transaction/groupTransaction",
  async (period,{rejectWithValue}) => {
      try {
        const res= await filterByPeriodTime(period)
        return res.data
      } catch (error) {
        return rejectWithValue(error.message)
      }
  }
)


export const addTransactions = createAsyncThunk(
  "transaction/addTransactions",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const res = await addTransaction(data);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateTransactions = createAsyncThunk(
  "transaction/updateTransactions",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateTransaction(data);
      console.log(res)
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const removeTransactions = createAsyncThunk(
  "transaction/removeTransactions",
  async (id, { rejectWithValue }) => {
    try {
      const res = await removeTransaction(id);
      console.log(res);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  transactions: null,
  totalBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
  todayTransactions:[],
  isLoading: false,
  filteredTransaction: [],
  searchKeyword: "",
  paginatedTransactions: [],
  currentPage: 1,
  itemsPerPage: 5,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      state.paginatedTransactions = state.transactions.slice(
        startIndex,
        startIndex + state.itemsPerPage,
      );
    },

    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
      const startIndex = 0;
      state.paginatedTransactions = state.transactions.slice(
        startIndex,
        startIndex + state.itemsPerPage,
      );
    },
    setFilteredTransactions(state, action) {
      state.filteredTransactions = action.payload.filteredTransactions;
      state.searchKeyword = action.payload.searchKeyword;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        updateTotalBalance(state);
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.isLoading = false;
      });


      builder
        .addCase(groupTransaction.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(groupTransaction.fulfilled, (state, action) => {
          state.isLoading = false;
          state.todayTransactions = action.payload;
        })
        .addCase(groupTransaction.rejected, (state) => {
          console.log("failed");
          state.isLoading = false;
        });
      
      // Add transaction
    builder
      .addCase(addTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.push(action.payload.data);
        showSuccessToast(action.payload.message);
        // updateTotalBalance();
      })
      .addCase(addTransactions.rejected, (state, action) => {
        state.isLoading = false;
        showErrorToast(action.payload);
      });

    // Update transaction
    builder
      .addCase(updateTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        const transactionIndex = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.data.id,
        );
        state.transactions[transactionIndex] = {
          ...state.transactions[transactionIndex],
          ...action.payload.data,
        };
        // updateTotalBalance();
        showSuccessToast(action.payload.message);
      })
      .addCase(updateTransactions.rejected, (state, action) => {
        state.isLoading = false;
        showErrorToast(action.payload);
      });

    // Remove transaction
    builder
      .addCase(removeTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload.id,
        );
        showSuccessToast(action.payload.message);
      })
      .addCase(removeTransactions.rejected, (state, action) => {
        state.isLoading = false;
        showErrorToast(action.payload);
      });
  },
});

const updateTotalBalance = (state) => {
  const transactions = [...state.transactions];
  const income = transactions
    .filter(
      (transaction) =>
        transaction.transactionType === "income" ||
        transaction.transactionType === "Income",
    )
    .reduce(
      (acc, transaction) => acc + Number(transaction.transactionAmount),
      0,
    );
  const expense = transactions
    .filter(
      (transaction) =>
        transaction.transactionType === "expense" ||
        transaction.transactionType === "Expense",
    )
    .reduce(
      (acc, transaction) => acc + Number(transaction.transactionAmount),
      0,
    );
  state.totalIncome = income;
  state.totalExpense = expense;
  state.totalBalance = income - expense;
};

export const { setCurrentPage, setItemsPerPage, setFilteredTransactions } =
  transactionSlice.actions;
export default transactionSlice.reducer;

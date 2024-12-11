import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { saveToStorage } from "./localStorage.js";
import { sortTransactionsByDate } from "../utils/date.js";

import {
  fetchAllTransaction,
  addTransaction,
} from "../services/transactionServices.js";

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async () => {
    try {
      const res = await fetchAllTransaction();
      return res.data;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  },
);

export const addTransactions = createAsyncThunk(
  "transaction/addTransactions",
  async (data) => {
    try {
      console.log(data);
      const res = await addTransaction(data);
      return res.data;
    } catch (error) {
      return error.message;
    }
  },
);

const initialState = {
  transactions: null,
  // transactionsList: null,
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
    updateTransaction: (state, action) => {
      const updatedData = action.payload;
      const transactionIndex = state.transactions.findIndex(
        (transaction) => transaction.id === updatedData.id,
      );
      if (transactionIndex >= 0) {
        state.transactions[transactionIndex] = {
          ...state.transactions[transactionIndex],
          ...updatedData,
        };
        state.transactions = sortTransactionsByDate(state.transactions);
        saveToStorage("transactions-list", state.transactions);
        updateTotalBalance(state);
      }
      if (state.searchKeyword) {
        state.filteredTransactions = state.transactions.filter((transaction) =>
          transaction.description
            .toLowerCase()
            .includes(state.searchKeyword.toLowerCase()),
        );
      } else {
        state.filteredTransactions = state.transactions;
      }
    },

    removeTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload,
      );
      state.transactions = sortTransactionsByDate(state.transactions);
      saveToStorage("transactions-list", state.transactions);
      updateTotalBalance(state);
      if (state.searchKeyword) {
        state.filteredTransactions = state.transactions.filter((transaction) =>
          transaction.description
            .toLowerCase()
            .includes(state.searchKeyword.toLowerCase()),
        );
      } else {
        state.filteredTransactions = state.transactions;
      }
    },

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
      })
      .addCase(fetchTransactions.rejected, (state) => {
        console.log("failed");
        state.isLoading = false;
        // state.error = action.payload;
      });

    builder
      .addCase(addTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.push(action.payload);
      })
      .addCase(addTransactions.rejected, (state) => {
        console.log("failed");
        state.isLoading = false;
      });
  },
});

const updateTotalBalance = (state) => {
  const transactions = [...state.transactions];
  const income = transactions
    .filter((transaction) => transaction.transactionType === "income")
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);
  const expense = transactions
    .filter((transaction) => transaction.transactionType === "expense")
    .reduce((acc, transaction) => acc + Number(transaction.amount), 0);
  state.totalIncome = income;
  state.totalExpense = expense;
  state.totalBalance = income - expense;
};

export const {
  updateTransaction,
  removeTransaction,
  setCurrentPage,
  setItemsPerPage,
  setFilteredTransactions,
} = transactionSlice.actions;
export default transactionSlice.reducer;

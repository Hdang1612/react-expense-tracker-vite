import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchAllTransaction,
  addTransaction,
  updateTransaction,
  removeTransaction,
} from "../services/transactionServices.js";
import { formatDate } from "../utils/date.js";
import { showErrorToast, showSuccessToast } from "../utils/Toaste.js";

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async () => {
    try {
      const res = await fetchAllTransaction();
      return res.data;
    } catch (error) {
      return error.message;
    }
  },
);

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
      console.log(res);
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
  todayTransactions: [],
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

    // Add transaction
    builder
      .addCase(addTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.push(action.payload.data);
        showSuccessToast(action.payload.message);
        updateTotalBalance(state);
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
        updateTotalBalance(state);
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
        updateTotalBalance(state);
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

export const selectTodayTransactions = (state) => {
  const today = new Date().toLocaleDateString("en-GB");
  if (state.transactions.transactions) {
    return state.transactions.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createAt).toLocaleDateString(
        "en-GB",
      );
      return transactionDate === today;
    });
  }
  return [];
};

// Nhóm giao dịch theo tuần
export const selectWeeklyTransactions = (state) => {
  const weeks = [];
  let currentWeek = [];
  let currentWeekKey = "";

  state.transactions.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.createAt);
    const startOfTransactionWeek = new Date(transactionDate);
    startOfTransactionWeek.setDate(
      transactionDate.getDate() -
        (transactionDate.getDay() === 0 ? 6 : transactionDate.getDay() - 1),
    );
    const endOfTransactionWeek = new Date(startOfTransactionWeek);
    endOfTransactionWeek.setDate(startOfTransactionWeek.getDate() + 6);

    const weekKey = `${formatDate(startOfTransactionWeek)} - ${formatDate(endOfTransactionWeek)}`; //name cho từng nhóm
    if (currentWeek.length > 0 && currentWeekKey !== weekKey) {
      weeks.push({
        name: currentWeekKey,
        transactions: currentWeek,
      });
      currentWeek = [];
    }

    currentWeek.push(transaction);
    currentWeekKey = weekKey;
  });
  if (currentWeek.length > 0) {
    weeks.push({
      name: currentWeekKey,
      transactions: currentWeek,
    });
  }

  return weeks;
};

// Nhóm giao dịch theo tháng
export const selectMonthlyTransactions = (state) => {
  const months = [];
  let currentMonth = [];
  state.transactions.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.createAt);
    const monthKey = `${transactionDate.getMonth() + 1}-${transactionDate.getFullYear()}`;
    if (
      currentMonth.length > 0 &&
      currentMonth[0].createAt &&
      `${new Date(currentMonth[0].createAt).getMonth() + 1}-${new Date(currentMonth[0].createAt).getFullYear()}` !==
        monthKey
    ) {
      months.push({
        name: `${new Date(currentMonth[0].createAt).getMonth() + 1}-${new Date(currentMonth[0].createAt).getFullYear()}`,
        transactions: currentMonth,
      });
      currentMonth = [];
    }
    currentMonth.push(transaction);
  });

  if (currentMonth.length > 0) {
    months.push({
      name: `${new Date(currentMonth[0].createAt).getMonth() + 1}-${new Date(currentMonth[0].createAt).getFullYear()}`,
      transactions: currentMonth,
    });
  }
  return months;
};

export const { setCurrentPage, setItemsPerPage, setFilteredTransactions } =
  transactionSlice.actions;
export default transactionSlice.reducer;

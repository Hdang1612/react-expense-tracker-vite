import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { formatDate } from "../utils/date.js";
import { showErrorToast, showSuccessToast } from "../utils/Toaste.js";
import {
  fetchAllTransaction,
  addTransaction,
  updateTransaction,
  removeTransaction,
  filterTransactions,
} from "../services/transactionServices.js";
import { addReceipt } from "../services/receiptServices.js";
import { fetchAllCategories, removeCategory,addCategory } from "../services/categoryServices.js";
export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchAllTransaction();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const filterTransaction = createAsyncThunk(
  "transaction/filterTransaction",
  async (params, { rejectWithValue }) => {
    try {
      const res = await filterTransactions(params);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
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

export const addReceiptImage = createAsyncThunk(
  "transaction/addReceiptImage",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const receipt = await addReceipt(data, id);
      return { id, receipt };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchAllCategory = createAsyncThunk(
  "transaction/fetchAllCategory",
  async ( _,{rejectWithValue }) => {
    try {
      const res = await fetchAllCategories();
      console.log(res);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "transaction/deleteCategory",
  async ( id,{rejectWithValue }) => {
    try {
      const res = await removeCategory(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addCate = createAsyncThunk(
  "transaction/addCate",
  async ( data,{rejectWithValue }) => {
    try {
      const res = await addCategory(data);
      console.log(res);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  transactions: [],
  categoriesList: [],
  totalBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
  isLoading: false,
  filteredTransaction: [],
  refresh: false,
  currentPage: 1,
  itemsPerPage: 5,
  totalPage: null,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setCurrentPages: (state, action) => {
      state.currentPage = action.payload;
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
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // filter
    builder
      .addCase(filterTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(filterTransaction.fulfilled, (state, action) => {
        if (action.payload && action.payload.pagination) {
          state.filteredTransaction = action.payload.data;
          state.currentPage = action.payload.pagination.currentPage;
          state.itemsPerPage = action.payload.pagination.limit;
          state.totalPage = action.payload.pagination.totalPages;
        } else {
          state.filteredTransaction = [];
          state.currentPage = 1;
          state.itemsPerPage = 0;
          state.totalPage = 1;
        }

        state.refresh = false;
      })
      .addCase(filterTransaction.rejected, (state, action) => {
        state.error = action.payload;
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
        state.refresh = true;
        showSuccessToast(action.payload.message);
        updateTotalBalance(state);
      })
      .addCase(addTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
        state.refresh = true;
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
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload.id,
        );
        state.refresh = true;
        showSuccessToast(action.payload.message);
        updateTotalBalance(state);
      })
      .addCase(removeTransactions.rejected, (state, action) => {
        state.isLoading = false;
        showErrorToast(action.payload);
      });

    builder
      .addCase(addReceiptImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReceiptImage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, receipt } = action.payload;
        const transactionIndex = state.transactions.findIndex(
          (transaction) => transaction.id === id,
        );
        if (transactionIndex !== -1) {
          state.transactions[transactionIndex].receipt = receipt;
        }
        // state.refresh = true;
      })
      .addCase(addReceiptImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showErrorToast(action.payload);
      });

    builder
      .addCase(fetchAllCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.categoriesList = action.payload.data;
      })
      .addCase(fetchAllCategory.rejected, (state, action) => {
        state.isLoading = false;
        showErrorToast(action.payload);
      });

    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categoriesList = state.categoriesList.filter(
          (category) => category.id !== action.payload.id,
        );
        showSuccessToast(action.payload.message);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        showErrorToast(action.payload);
      });

    builder
      .addCase(addCate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCate.fulfilled, (state, action) => {
        state.categoriesList.push(action.payload.data);
        // state.refresh = true;
        showSuccessToast(action.payload.message);
      })
      .addCase(addCate.rejected, (state, action) => {
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

export const { setCurrentPages, setItemsPerPage, setFilteredTransactions } =
  transactionSlice.actions;
export default transactionSlice.reducer;

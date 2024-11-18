import { createSlice } from "@reduxjs/toolkit";
import { getFromStorage, saveToStorage } from "./localStorage.jsx";
import { sortTransactionsByDate, formatDate } from "../untils/date.jsx";
const calculateInitialBalances = (transactions) => {
  const income = transactions
    .filter((transaction) => transaction.transactionType === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  return {
    totalIncome: income,
    totalExpense: expense,
    totalBalance: income + expense,
  };
};

const persistedTransactions = getFromStorage("transactions-list") || [];
const initialBalances = calculateInitialBalances(persistedTransactions);

const initialState = {
  transactions: persistedTransactions,
  ...initialBalances,
  transactionsList: [],
  paginatedTransactions: [],
  currentPage: 1,
  itemsPerPage: 5,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
      state.transactions = sortTransactionsByDate(state.transactions);
      saveToStorage("transactions-list", state.transactions);
      updateTotalBalance(state);
    },

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
    },

    removeTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload,
      );
      state.transactions = sortTransactionsByDate(state.transactions);
      saveToStorage("transactions-list", state.transactions);
      updateTotalBalance(state);
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
  },
});

const updateTotalBalance = (state) => {
  const transactions = [...state.transactions];
  const income = transactions
    .filter((transaction) => transaction.transactionType === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const expense = transactions
    .filter((transaction) => transaction.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  state.totalIncome = income;
  state.totalExpense = expense;
  state.totalBalance = income + expense;
};

//các nhóm transaction

export const selectTodayTransactions = (state) => {
  const today = new Date().toLocaleDateString("en-GB");
  return state.transactions.transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date).toLocaleDateString(
      "en-GB",
    );
    return transactionDate === today;
  });
};

// Nhóm giao dịch theo tuần
export const selectWeeklyTransactions = (state) => {
  const weeks = [];
  let currentWeek = [];
  let currentWeekKey = "";

  state.transactions.transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
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
    const transactionDate = new Date(transaction.date);
    const monthKey = `${transactionDate.getMonth() + 1}-${transactionDate.getFullYear()}`;
    if (
      currentMonth.length > 0 &&
      currentMonth[0].date &&
      `${new Date(currentMonth[0].date).getMonth() + 1}-${new Date(currentMonth[0].date).getFullYear()}` !==
        monthKey
    ) {
      months.push({
        name: `${new Date(currentMonth[0].date).getMonth() + 1}-${new Date(currentMonth[0].date).getFullYear()}`,
        transactions: currentMonth,
      });
      currentMonth = [];
    }
    currentMonth.push(transaction);
  });

  if (currentMonth.length > 0) {
    months.push({
      name: `${new Date(currentMonth[0].date).getMonth() + 1}-${new Date(currentMonth[0].date).getFullYear()}`,
      transactions: currentMonth,
    });
  }
  return months;
};

export const {
  addTransaction,
  updateTransaction,
  removeTransaction,
  setCurrentPage,
  setItemsPerPage,
} = transactionSlice.actions;
export default transactionSlice.reducer;
